const API_KEY = "856f796784a04423a6da785ed45ac73e";
const BASE_URL = "/api/newsapi";

/**
 * Fetch cybersecurity news from NewsAPI.
 * Uses Vite proxy to avoid CORS issues in the browser.
 * Returns an array of article objects.
 */
export async function fetchCyberSecurityNews() {
  try {
    const response = await fetch(
      `${BASE_URL}/v2/everything?q=cybersecurity&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NewsAPI responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "Unknown API error");
    }

    return data.articles || [];
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
}