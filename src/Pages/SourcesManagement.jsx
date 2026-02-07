export default function SourcesManagement({ navigateTo }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0e0e12",
        color: "#e8e6e1",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          opacity: 0,
          animation: "fadeSlideUp 0.6s ease forwards 0.1s",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#82aaff",
            marginBottom: "40px",
          }}
        >
          Sources Management
        </p>
        <button
          onClick={() => navigateTo("home")}
          style={{
            background: "linear-gradient(135deg, #c792ea, #82aaff)",
            border: "none",
            borderRadius: "12px",
            color: "#0e0e12",
            padding: "14px 36px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(199,146,234,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}