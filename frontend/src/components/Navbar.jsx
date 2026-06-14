export default function Navbar({ onHome, showBack, onBack, onHistory }) {
  return (
    <nav className="nav">
      <button
        type="button"
        onClick={onHome}
        className="nav-logo"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        Content<span>AI</span>
      </button>
      <div className="nav-right">
        {showBack && (
          <>
            <button
              type="button"
              onClick={onHistory}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 999,
                border: "1.5px solid var(--border2)",
                background: "var(--white)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13, fontWeight: 600, color: "var(--ink2)",
                cursor: "pointer", transition: "all .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--teal)"; e.currentTarget.style.color = "var(--teal)"; e.currentTarget.style.background = "var(--teal-l)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--ink2)"; e.currentTarget.style.background = "var(--white)"; }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="1" width="4.5" height="4.5" rx="1"/>
                <rect x="7.5" y="1" width="4.5" height="4.5" rx="1"/>
                <rect x="1" y="7.5" width="4.5" height="4.5" rx="1"/>
                <rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1"/>
              </svg>
              History
            </button>
            <button
              type="button"
              onClick={onBack}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 999,
                border: "1.5px solid var(--border2)",
                background: "var(--white)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13, fontWeight: 600, color: "var(--ink2)",
                cursor: "pointer", transition: "all .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--teal)"; e.currentTarget.style.color = "var(--teal)"; e.currentTarget.style.background = "var(--teal-l)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--ink2)"; e.currentTarget.style.background = "var(--white)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 2.5L3.5 7l5 4.5"/>
              </svg>
              Home
            </button>
          </>
        )}
        <div className="nav-status">
          <span className="live" />
          Groq · llama-3.3-70b
        </div>
      </div>
    </nav>
  );
}
