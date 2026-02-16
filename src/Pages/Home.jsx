import { useState } from "react";
import Sidebar, {
  SIDEBAR_WIDTH_OPEN,
  SIDEBAR_WIDTH_CLOSED,
} from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import NewsFeed from "../components/NewsFeed";
import ViewToggle from "../components/ViewToggle";

export default function Home({ navigateTo }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem("viewMode");
    return saved || "compact";
  });
  const marginLeft = sidebarOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED;

  return (
    <>
      <Sidebar
        open={sidebarOpen}
        setOpen={(val) => {
          const newVal = typeof val === "function" ? val(sidebarOpen) : val;
          localStorage.setItem("sidebarOpen", JSON.stringify(newVal));
          setSidebarOpen(newVal);
        }}
        navigateTo={(page) => {
          if (page === "home") {
            window.location.reload();
          } else {
            navigateTo(page);
          }
        }}
      />
      <div
        style={{
          marginLeft: `${marginLeft}px`,
          transition: "margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          minHeight: "100vh",
          background: "#0e0e12",
          color: "#e8e6e1",
          fontFamily: "'DM Sans', sans-serif",
          overflowX: "hidden",
          width: `calc(100vw - ${marginLeft}px)`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <SearchBar />
          </div>
        </div>
        <div
          style={{
            padding: "60px 60px 60px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Welcome heading */}
          <div
            style={{
              opacity: 0,
              animation: "fadeSlideUp 0.6s ease forwards 0.15s",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                lineHeight: 1.1,
                margin: "0",
                background: "linear-gradient(135deg, #e8e6e1 0%, #c792ea 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Home
            </h1>
          </div>

          {/* Feed section */}
          <div style={{ marginTop: "48px" }}>
            {/* Section header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
                opacity: 0,
                animation: "fadeSlideUp 0.6s ease forwards 0.25s",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                {/* Shield icon */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background:
                      "linear-gradient(135deg, rgba(199,146,234,0.12), rgba(130,170,255,0.12))",
                    border: "1px solid rgba(199,146,234,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c792ea"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#e8e6e1",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    Cybersecurity Feed
                  </h2>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#5a5a6a",
                      margin: "2px 0 0 0",
                    }}
                  >
                    Latest news — refreshes on page reload
                  </p>
                </div>
              </div>

              {/* View toggle button */}
              <ViewToggle
                viewMode={viewMode}
                setViewMode={(mode) => {
                  localStorage.setItem("viewMode", mode);
                  setViewMode(mode);
                }}
              />
            </div>

            {/* News feed */}
            <NewsFeed viewMode={viewMode} />
          </div>
        </div>
      </div>
    </>
  );
}