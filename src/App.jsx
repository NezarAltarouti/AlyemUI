import { useState } from "react";
import Home from "./Pages/Home";
import SourcesManagements from "./Pages/SourcesManagement";

export default function App() {
  const [page, setPage] = useState("home");

  const navigateTo = (p) => setPage(p);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0e0e12; overflow-x: hidden; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      {page === "home" && <Home navigateTo={navigateTo} />}
      {page === "sources" && <SourcesManagements navigateTo={navigateTo} />}
    </>
  );
}