import { useState } from "react";
import Sidebar, { SIDEBAR_WIDTH_OPEN, SIDEBAR_WIDTH_CLOSED } from "../components/Sidebar";
import SearchBar from '../components/SearchBar';

export default function Home({ navigateTo }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const marginLeft = sidebarOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED;

  return (
    <>
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
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
        }}
      >
        <div style={{position: "relative", display: "flex", justifyContent: "center", marginTop: "20px"}}>
          <div style={{display: "flex", alignItems: "center"}}>
            <SearchBar/>
          </div>
        </div>
        <div style={{ padding: "60px 60px 60px" }}>
          <div style={{ opacity: 0, animation: "fadeSlideUp 0.6s ease forwards 0.15s" }}>
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
        </div>
      </div>
    </>
  );
}