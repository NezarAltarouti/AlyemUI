// OllamaService2.js
// Service module for local Ollama API (llama3.2).
// Provides article summarization via the /api/generate endpoint.

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const OLLAMA_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_OLLAMA_BASE) ||
  "http://localhost:11434";

const OLLAMA_MODEL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_OLLAMA_MODEL) ||
  "llama3.2";

// ---------------------------------------------------------------------------
// Error type
// ---------------------------------------------------------------------------

export class OllamaError extends Error {
  constructor(message, status, url) {
    super(message);
    this.name = "OllamaError";
    this.status = status;
    this.url = url;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns true if a string field has actual content (not null/empty/whitespace). */
function hasContent(field) {
  return typeof field === "string" && field.trim().length > 0;
}

/** Strip HTML tags and collapse whitespace. */
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

/**
 * Builds a summarization prompt that adapts to whatever fields are available.
 *
 * Strategy:
 *   - If full content exists -> summarize the content.
 *   - If only description/summary exists -> expand it into a coherent summary.
 *   - If only title exists -> infer what the article is likely about from the title alone
 *     (and tell the model to be honest about the limited info).
 *
 * @param {Object} article
 * @param {string} [article.title]
 * @param {string} [article.content]
 * @param {string} [article.description]
 * @param {string} [article.source]
 * @param {string} [article.author]
 */
function buildSummaryPrompt(article) {
  const hasTitle = hasContent(article.title);
  const hasDescription = hasContent(article.description);
  const hasFullContent = hasContent(article.content);
  const hasSource = hasContent(article.source);
  const hasAuthor = hasContent(article.author);

  // Decide on the strategy based on what's available.
  let instruction;
  if (hasFullContent) {
    instruction =
      "Summarize the following news article in 3-5 sentences. " +
      "Focus on the key facts, main argument, and important conclusions. " +
      "Write in a neutral, informative tone. Do not add opinions or commentary. " +
      "Do not start with 'This article' or 'The article' - jump straight into the summary.";
  } else if (hasDescription) {
    instruction =
      "Below is a short description of a news article. The full content is not available. " +
      "Expand this description into a clear, informative 2-3 sentence summary based ONLY on what is provided. " +
      "Do not invent facts. Do not speculate beyond what the description states.";
  } else if (hasTitle) {
    instruction =
      "Below is only the title of a news article - no other content is available. " +
      "Provide a brief 1-2 sentence note explaining what the article is likely about based on the title. " +
      "Be explicit that this is inferred from the title alone and that full content is not available.";
  } else {
    instruction =
      "No article information was provided. Respond with: 'No content available to summarize.'";
  }

  const parts = [instruction, ""];

  // Add available fields, skipping anything empty.
  if (hasTitle) parts.push(`Title: ${article.title.trim()}`);
  if (hasSource) parts.push(`Source: ${article.source.trim()}`);
  if (hasAuthor) parts.push(`Author: ${article.author.trim()}`);
  if (hasDescription) parts.push(`Description: ${article.description.trim()}`);

  if (hasFullContent) {
    const plain = stripHtml(article.content);
    const trimmed = plain.length > 3000 ? plain.slice(0, 3000) + "…" : plain;
    parts.push(`\nContent:\n${trimmed}`);
  }

  parts.push("\nSummary:");

  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Core API methods
// ---------------------------------------------------------------------------

/** Non-streaming summarization. */
async function summarize(article, signal) {
  const prompt = buildSummaryPrompt(article);
  const url = `${OLLAMA_BASE}/api/generate`;

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        options: { temperature: 0.3, top_p: 0.9, num_predict: 300 },
      }),
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new OllamaError(
      `Failed to connect to Ollama at ${OLLAMA_BASE}. Is Ollama running?`,
      0,
      url,
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new OllamaError(
      `Ollama API error ${res.status}: ${body || res.statusText}`,
      res.status,
      url,
    );
  }

  const data = await res.json();
  return (data.response || "").trim();
}

/** Streaming summarization with progressive chunks. */
async function summarizeStream(article, onChunk, signal) {
  const prompt = buildSummaryPrompt(article);
  const url = `${OLLAMA_BASE}/api/generate`;

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: true,
        options: { temperature: 0.3, top_p: 0.9, num_predict: 300 },
      }),
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new OllamaError(
      `Failed to connect to Ollama at ${OLLAMA_BASE}. Is Ollama running?`,
      0,
      url,
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new OllamaError(
      `Ollama API error ${res.status}: ${body || res.statusText}`,
      res.status,
      url,
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Ollama emits newline-delimited JSON. Process complete lines only.
    const lines = buffer.split("\n");
    buffer = lines.pop(); // last (possibly incomplete) line stays in buffer

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        if (parsed.response) {
          fullText += parsed.response;
          if (typeof onChunk === "function") onChunk(parsed.response);
        }
      } catch {
        // skip malformed line
      }
    }
  }

  return fullText.trim();
}

/** Health check — verifies Ollama is reachable and model is available. */
async function healthCheck() {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      return { ok: false, error: `Ollama responded with ${res.status}` };
    }
    const data = await res.json();
    const models = (data.models || []).map((m) => m.name);
    const hasModel = models.some(
      (name) => name === OLLAMA_MODEL || name.startsWith(`${OLLAMA_MODEL}:`),
    );
    return {
      ok: true,
      models,
      hasModel,
      ...(hasModel
        ? {}
        : {
            warning: `Model "${OLLAMA_MODEL}" not found. Available: ${models.join(", ") || "none"}`,
          }),
    };
  } catch (err) {
    return {
      ok: false,
      error: `Cannot reach Ollama at ${OLLAMA_BASE}: ${err.message}`,
    };
  }
}

// ---------------------------------------------------------------------------
// Default export
// ---------------------------------------------------------------------------

const ollama = {
  baseUrl: OLLAMA_BASE,
  model: OLLAMA_MODEL,
  OllamaError,
  buildSummaryPrompt,
  summarize,
  summarizeStream,
  healthCheck,
};

export default ollama;