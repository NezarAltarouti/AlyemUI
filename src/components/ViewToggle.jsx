import { useState } from "react";

/**
 * ViewToggle — two-button toggle to switch between "compact" and "grid" view modes.
 */
export default function ViewToggle({ viewMode, setViewMode }) {
  const [hovered, setHovered] = useState(null);

  const buttons = [
    {
      key: "compact",
      label: "List",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      key: "grid",
      label: "Grid",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "10px",
        padding: "4px",
      }}
    >
      {buttons.map((btn) => {
        const isActive = viewMode === btn.key;
        const isHov = hovered === btn.key;

        return (
          <button
            key={btn.key}
            onClick={() => setViewMode(btn.key)}
            onMouseEnter={() => setHovered(btn.key)}
            onMouseLeave={() => setHovered(null)}
            title={btn.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 500,
              fontFamily: "inherit",
              transition: "all 0.2s ease",
              background: isActive
                ? "rgba(199,146,234,0.15)"
                : isHov
                ? "rgba(255,255,255,0.05)"
                : "transparent",
              color: isActive
                ? "#c792ea"
                : isHov
                ? "#e8e6e1"
                : "#6a6a7a",
            }}
          >
            {btn.icon}
            <span
              style={{
                fontSize: "12px",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {btn.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}