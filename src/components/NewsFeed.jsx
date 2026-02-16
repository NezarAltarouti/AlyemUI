import { useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import NewsCardGrid from "./NewsCardGrid";
import { fetchCyberSecurityNews } from "../services/newsApi";

/**
 * NewsFeed — fetches cybersecurity news on mount (and on page refresh)
 * and renders a list of NewsCard (compact) or NewsCardGrid (grid) components.
 */
export default function NewsFeed({ viewMode = "compact" }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCyberSecurityNews();
        if (!cancelled) {
          // Filter out articles with "[Removed]" title (NewsAPI quirk)
          const cleaned = data.filter(
            (a) => a.title && a.title !== "[Removed]"
          );
          setArticles(cleaned);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load news");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNews();

    return () => {
      cancelled = true;
    };
  }, []);

  const isGrid = viewMode === "grid";

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div
        style={
          isGrid
            ? {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
                width: "100%",
                boxSizing: "border-box",
              }
            : {
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                width: "100%",
                boxSizing: "border-box",
              }
        }
      >
        {[...Array(isGrid ? 6 : 5)].map((_, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: "16px",
              padding: "24px 28px",
              minHeight: isGrid ? "220px" : "100px",
              opacity: 0,
              animation: `fadeSlideUp 0.4s ease forwards ${i * 0.08}s`,
            }}
          >
            {/* Source skeleton */}
            <div
              style={{
                width: "80px",
                height: "20px",
                borderRadius: "6px",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
                marginBottom: "12px",
              }}
            />
            {/* Title skeleton */}
            <div
              style={{
                width: `${70 + Math.random() * 25}%`,
                height: "18px",
                borderRadius: "4px",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
                marginBottom: "8px",
              }}
            />
            <div
              style={{
                width: `${40 + Math.random() * 30}%`,
                height: "18px",
                borderRadius: "4px",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            />
          </div>
        ))}

        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          opacity: 0,
          animation: "fadeSlideUp 0.5s ease forwards 0.1s",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "rgba(255,100,100,0.08)",
            border: "1px solid rgba(255,100,100,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff6464"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p
          style={{
            color: "#ff6464",
            fontSize: "15px",
            fontWeight: 500,
            marginBottom: "8px",
          }}
        >
          Unable to load news
        </p>
        <p
          style={{
            color: "#5a5a6a",
            fontSize: "13px",
            maxWidth: "360px",
            margin: "0 auto",
          }}
        >
          {error}. Refresh the page to try again.
        </p>
      </div>
    );
  }

  /* ── Empty state ── */
  if (articles.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          opacity: 0,
          animation: "fadeSlideUp 0.5s ease forwards 0.1s",
        }}
      >
        <p style={{ color: "#5a5a6a", fontSize: "15px" }}>
          No articles found. Refresh the page to try again.
        </p>
      </div>
    );
  }

  /* ── Article list / grid ── */
  const CardComponent = isGrid ? NewsCardGrid : NewsCard;

  return (
    <div
      style={
        isGrid
          ? {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              width: "100%",
              boxSizing: "border-box",
            }
          : {
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "100%",
              boxSizing: "border-box",
            }
      }
    >
      {articles.map((article, i) => (
        <CardComponent
          key={article.url + i}
          title={article.title}
          publishedAt={article.publishedAt}
          url={article.url}
          source={article.source?.name}
          description={article.description}
          index={i}
        />
      ))}
    </div>
  );
}