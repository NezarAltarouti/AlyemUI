import { useState, useEffect, useRef } from "react";
import api from "../services/aleymApi";
import ollama from "../services/OllamaService2";

/**
 * SummaryModal — popup that fetches an article and shows an AI summary.
 *
 * Renders as a centered overlay/modal (not a full page). Closes on:
 *   - clicking the backdrop
 *   - clicking the close (×) button
 *   - pressing Escape
 *
 * Props:
 *   - articleId: string (UUID) — null/undefined hides the modal
 *   - onClose: () => void
 */
export default function SummaryModal({ articleId, onClose }) {
  const [article, setArticle] = useState(null);
  const [sourceName, setSourceName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const [summaryDone, setSummaryDone] = useState(false);

  const abortRef = useRef(null);

  // Single effect: load article + stream summary in sequence.
  useEffect(() => {
    if (!articleId) return;
    let cancelled = false;
    const controller = new AbortController();
    abortRef.current = controller;

    // Reset state for new article
    setLoading(true);
    setError(null);
    setArticle(null);
    setSourceName("");
    setSummary("");
    setSummaryDone(false);
    setSummaryError(null);
    setSummarizing(false);

    async function loadAndSummarize() {
      try {
        // 1) Fetch article + sources
        const [articleData, sourcesData] = await Promise.all([
          api.articles.getById(articleId),
          api.sources.list(),
        ]);
        if (cancelled) return;

        setArticle(articleData);
        const src = (sourcesData || []).find(
          (s) => s.id === articleData.source,
        );
        const name = src?.name ?? "Unknown";
        setSourceName(name);
        setLoading(false);

        // 2) Stream summary (Ollama handles missing fields gracefully)
        setSummarizing(true);
        await ollama.summarizeStream(
          {
            title: articleData.title,
            content: articleData.content || "",
            description: articleData.summary || "",
            source: name,
          },
          (chunk) => {
            if (!cancelled) setSummary((prev) => prev + chunk);
          },
          controller.signal,
        );
        if (cancelled) return;
        setSummaryDone(true);
      } catch (err) {
        if (cancelled || err.name === "AbortError") return;
        // Distinguish article-load failure vs summary failure
        if (!article && !summary) {
          setError(err.message || "Failed to load article");
        } else {
          setSummaryError(err.message || "Failed to generate summary");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setSummarizing(false);
        }
      }
    }

    loadAndSummarize();

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  // Close on Escape
  useEffect(() => {
    if (!articleId) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [articleId, onClose]);

  // Don't render if no article requested
  if (!articleId) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "modalFadeIn 0.2s ease",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#15151b",
          border: "1px solid rgba(255,203,107,0.15)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,203,107,0.05)",
          animation: "modalSlideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 12px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              borderRadius: "6px",
              background: "rgba(255,203,107,0.1)",
              border: "1px solid rgba(255,203,107,0.2)",
              color: "#ffcb6b",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="m4.93 4.93 2.83 2.83" />
              <path d="m16.24 16.24 2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="m4.93 19.07 2.83-2.83" />
              <path d="m16.24 7.76 2.83-2.83" />
            </svg>
            AI Summary
          </div>

          <button
            onClick={onClose}
            aria-label="Close summary"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#6a6a7a",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
              fontSize: "16px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,100,100,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,100,100,0.2)";
              e.currentTarget.style.color = "#ff6464";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#6a6a7a";
            }}
          >
            &#10005;
          </button>
        </div>

        {/* Body — scrollable */}
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {/* Loading article */}
          {loading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "40px 0",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  border: "3px solid rgba(255,255,255,0.06)",
                  borderTop: "3px solid #ffcb6b",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p style={{ color: "#5a5a6a", fontSize: "13px", margin: 0 }}>
                Loading article…
              </p>
            </div>
          )}

          {/* Article load error */}
          {error && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p
                style={{
                  color: "#ff8a8a",
                  fontSize: "14px",
                  margin: "0 0 4px 0",
                  fontWeight: 500,
                }}
              >
                Unable to load article
              </p>
              <p style={{ color: "#5a5a6a", fontSize: "12px", margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          {/* Article loaded — show title + summary */}
          {!loading && !error && article && (
            <>
              {/* Source */}
              {sourceName && (
                <div
                  style={{
                    display: "inline-block",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "#c792ea",
                    background: "rgba(199,146,234,0.08)",
                    border: "1px solid rgba(199,146,234,0.12)",
                    borderRadius: "6px",
                    padding: "3px 10px",
                    marginBottom: "14px",
                  }}
                >
                  {sourceName}
                </div>
              )}

              {/* Title */}
              <h2
                style={{
                  fontSize: "18px",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: "#e8e6e1",
                  margin: "0 0 20px 0",
                }}
              >
                {article.title}
              </h2>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(90deg, rgba(255,203,107,0.4), transparent)",
                  marginBottom: "20px",
                }}
              />

              {/* Summary text */}
              {summary && (
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.75,
                    color: "#c8c6c1",
                    fontFamily: "'Source Serif 4', serif",
                    margin: 0,
                    letterSpacing: "0.2px",
                  }}
                >
                  {summary}
                  {summarizing && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "7px",
                        height: "16px",
                        background: "#ffcb6b",
                        marginLeft: "2px",
                        verticalAlign: "text-bottom",
                        animation: "blink 1s steps(2) infinite",
                      }}
                    />
                  )}
                </p>
              )}

              {/* Initial summarizing state (no text yet) */}
              {!summary && summarizing && !summaryError && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#5a5a6a",
                    fontSize: "13px",
                    fontStyle: "italic",
                  }}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid rgba(255,203,107,0.2)",
                      borderTop: "2px solid #ffcb6b",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Generating summary with {ollama.model}…
                </div>
              )}

              {/* Summary error */}
              {summaryError && (
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "rgba(255,100,100,0.06)",
                    border: "1px solid rgba(255,100,100,0.15)",
                  }}
                >
                  <p
                    style={{
                      color: "#ff8a8a",
                      fontSize: "13px",
                      margin: "0 0 4px 0",
                      fontWeight: 500,
                    }}
                  >
                    Could not generate summary
                  </p>
                  <p
                    style={{
                      color: "#8a5a5a",
                      fontSize: "12px",
                      margin: 0,
                    }}
                  >
                    {summaryError}
                  </p>
                </div>
              )}

              {/* Done footer */}
              {summaryDone && (
                <p
                  style={{
                    marginTop: "20px",
                    paddingTop: "14px",
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    fontSize: "10px",
                    color: "#3a3a4a",
                    margin: "20px 0 0 0",
                    paddingTop: "14px",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                  }}
                >
                  Generated locally by {ollama.model} via Ollama
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes blink { 0%{opacity:1} 50%{opacity:0} }
        @keyframes modalFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}