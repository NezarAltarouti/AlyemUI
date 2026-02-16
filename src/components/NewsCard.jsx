import { useState } from "react";

/**
 * NewsCard — displays a single news article.
 * Props:
 *   - title: string
 *   - publishedAt: ISO date string
 *   - url: source URL
 *   - source: source name string
 *   - description: short description
 *   - index: number (for staggered animation)
 */
export default function NewsCard({
  title,
  publishedAt,
  url,
  source,
  description,
  index = 0,
}) {
  const [hovered, setHovered] = useState(false);

  const date = new Date(publishedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const delay = Math.min(index * 0.06, 1.2);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        opacity: 0,
        animation: `fadeSlideUp 0.5s ease forwards ${delay}s`,
      }}
    >
      <div
        style={{
          background: hovered
            ? "linear-gradient(135deg, rgba(199,146,234,0.06) 0%, rgba(130,170,255,0.06) 100%)"
            : "rgba(255,255,255,0.02)",
          border: "1px solid",
          borderColor: hovered
            ? "rgba(199,146,234,0.2)"
            : "rgba(255,255,255,0.06)",
          borderRadius: "16px",
          padding: "24px 28px",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 8px 32px rgba(199,146,234,0.08), 0 2px 8px rgba(0,0,0,0.3)"
            : "0 1px 4px rgba(0,0,0,0.2)",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          minHeight: "100px",
        }}
      >
        {/* Left content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Source badge */}
          <div
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#82aaff",
              background: "rgba(130,170,255,0.08)",
              border: "1px solid rgba(130,170,255,0.12)",
              borderRadius: "6px",
              padding: "3px 10px",
              marginBottom: "12px",
            }}
          >
            {source || "News"}
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: 1.45,
              color: hovered ? "#e8e6e1" : "#c8c6c1",
              margin: 0,
              transition: "color 0.2s ease",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.5,
                color: "#6a6a7a",
                margin: "8px 0 0 0",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </p>
          )}

          {/* Date row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "14px",
            }}
          >
            {/* Calendar icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5a5a6a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span
              style={{ fontSize: "12px", color: "#5a5a6a", fontWeight: 500 }}
            >
              {formattedDate}
            </span>
            <span style={{ fontSize: "12px", color: "#3a3a4a" }}>•</span>
            <span style={{ fontSize: "12px", color: "#5a5a6a" }}>
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Right arrow */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: hovered
              ? "linear-gradient(135deg, #c792ea, #82aaff)"
              : "rgba(255,255,255,0.04)",
            border: "1px solid",
            borderColor: hovered ? "transparent" : "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            marginTop: "4px",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={hovered ? "#0e0e12" : "#6a6a7a"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: "stroke 0.2s ease, transform 0.2s ease",
              transform: hovered ? "translateX(2px)" : "translateX(0)",
            }}
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </a>
  );
}
