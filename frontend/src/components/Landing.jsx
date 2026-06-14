export default function Landing({ onGenerate, onRepurpose }) {
  return (
    <div className="landing">

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div>
          <div className="hero-eyebrow">✦ AI-Powered Content Studio</div>
          <h1 className="hero-h1">
            Write content that<br />
            <em>actually resonates.</em>
          </h1>
          <p className="hero-p">
            Describe what you need in plain English.
            ContentAI understands your intent, confirms it with you,
            then generates two polished versions to choose from.
          </p>
          <div className="hero-actions">
            <button className="btn-teal" onClick={onGenerate} style={{ padding: "13px 28px", fontSize: 15 }}>
              Start creating →
            </button>
            <button className="btn-outline" onClick={onRepurpose}>
              Repurpose existing content
            </button>
          </div>
        </div>

        {/* App preview */}
        <div className="hero-visual fu">
          <div className="mockup-shell">
            <div className="mockup-bar">
              <div className="mock-dot" style={{ background: "#FF5F57" }} />
              <div className="mock-dot" style={{ background: "#FEBC2E" }} />
              <div className="mock-dot" style={{ background: "#28C840" }} />
              <div style={{ marginLeft: 8, fontSize: 11, color: "var(--ink4)", fontFamily: "Inter, sans-serif" }}>
                ContentAI — Studio
              </div>
            </div>
            <div className="mockup-body">
              <div className="mock-prompt">
                "Write an inspirational LinkedIn post about overcoming startup failure,
                casual but professional tone, for founders…"
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className="mock-tag">LinkedIn post</span>
                <span className="mock-tag">Inspirational · Casual</span>
                <span className="mock-tag">Founders</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Version A — Structured", color: "var(--teal-l)", tc: "var(--teal)" },
                  { label: "Version B — Creative", color: "var(--gold-l)", tc: "var(--gold)" },
                ].map(({ label, color, tc }) => (
                  <div key={label} style={{ background: "var(--cream)", borderRadius: 8, border: "1px solid var(--border)", overflow: "hidden" }}>
                    <div style={{ padding: "7px 10px", background: color, fontSize: 10, fontWeight: 700, color: tc, fontFamily: "Inter,sans-serif" }}>
                      {label}
                    </div>
                    <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 5 }}>
                      {[85, 70, 90, 60, 75].map((w, i) => (
                        <div key={i} className={`mock-line ${i === 0 ? "mock-line-dark" : ""}`} style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <div className="how-inner">
          <span className="section-label">How it works</span>
          <h2 className="section-title">From idea to polished content in minutes</h2>
          <div className="steps-grid">
            {[
              { n: "1", title: "Describe freely", desc: "Type your request in plain English. Include topic, tone, audience — or just the idea. No forms, no dropdowns." },
              { n: "2", title: "AI confirms intent", desc: "ContentAI extracts your intent and shows it back to you. Edit anything before generating." },
              { n: "3", title: "Pick your version", desc: "Two versions are generated in parallel — one structured, one creative. Read both in full and choose." },
              { n: "4", title: "Edit and refine", desc: "Polish your chosen version with one-click suggestions or custom instructions on the right." },
            ].map(s => (
              <div key={s.n} className="step-card">
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <span className="section-label">Features</span>
        <h2 className="section-title" style={{ marginBottom: 32 }}>Everything a content creator needs</h2>
        <div className="features-grid">
          {[
            { icon: "🧠", title: "Intent understanding", desc: "Write naturally. The AI reads your full description and extracts content type, tone, audience, format and key points automatically." },
            { icon: "✌️", title: "Two versions always", desc: "Every generation produces two angles — structured and creative. You see both in full before picking one to edit." },
            { icon: "✏️", title: "Smart edit sidebar", desc: "One-click suggestions like 'Make it shorter', 'Add real example', 'Stronger opening' — plus a free-text custom instruction field." },
            { icon: "⟳", title: "Content repurposer", desc: "Paste any existing content — blog post, article, notes — and convert it natively to a tweet thread, LinkedIn post, email, and more." },
            { icon: "🌍", title: "Any language", desc: "Generate content in English, Urdu, Spanish, French, Arabic, or any language. Just mention it in your description." },
            { icon: "📋", title: "Copy & download", desc: "Copy to clipboard or download as a Markdown file with one click. No sign-up, no account, no paywalls." },
          ].map(f => (
            <div key={f.title} className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2 className="cta-h">Ready to write better, faster?</h2>
        <p className="cta-p">No sign-up required. Just describe what you need.</p>
        <button className="cta-btn" onClick={onGenerate}>
          Start creating for free →
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-logo">Content<span>AI</span></div>
        <div className="footer-links">
          <a href="#" className="footer-link">About</a>
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
        </div>
        <div className="footer-copy">Built with LangChain + Groq · 2026</div>
      </footer>
    </div>
  );
}
