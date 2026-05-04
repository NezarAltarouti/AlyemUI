import { useState } from "react";

/**
 * SummarizeButton — a small icon button that triggers AI summarization.
 *
 * Designed to sit alongside the existing upvote/downvote/read buttons in
 * both NewsCard and NewsCardGrid. When clicked, it calls `onSummarize`
 * which the parent uses to open ArticlePage in summary mode.
 *
 * Props:
 *   - articleId: string (UUID) — the article to summarize
 *   - onSummarize: (articleId: string) => void — callback to open summary view
 *   - iconBtnStyle: (isHover, isActive, gradient) => object — shared button style fn
 *   - tooltipStyle: object — shared tooltip style
 *   - strokeFor: (isHover, isActive) => string — shared stroke color fn
 */
export default function SummarizeButton({
  articleId,
  onSummarize,
  iconBtnStyle,
  tooltipStyle,
  strokeFor,
}) {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (typeof onSummarize === "function" && articleId) {
      onSummarize(articleId);
    }
  };

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        aria-label="Summarize with AI"
        onClick={handleClick}
        style={iconBtnStyle(
          hovered,
          false,
          "linear-gradient(135deg, #ffcb6b, #f78c6c)",
        )}
      >
        {/* Sparkle / AI icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeFor(hovered, false)}
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
      </button>
      {hovered && <div style={tooltipStyle}>AI Summary</div>}
    </div>
  );
}