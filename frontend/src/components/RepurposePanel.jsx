import { useState } from "react";
import { api } from "../api/generate";

const FORMATS = [
  "Twitter/X thread","LinkedIn post","Instagram caption","Newsletter section",
  "YouTube script","Podcast outline","Blog post","Email copy",
  "Press release","Ad copy","Case study summary","FAQ section","Reddit post",
];

export default function RepurposePanel({ onDone }) {
  const [content, setContent] = useState("");
  const [target,  setTarget]  = useState("");
  const [custom,  setCustom]  = useState("");
  const [notes,   setNotes]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const run = async () => {
    const fmt = custom.trim() || target;
    if (!content.trim() || !fmt) return;
    setLoading(true); setError("");
    try {
      const d = await api.repurpose(content, fmt, notes);
      onDone(d.output, fmt);
    } catch { setError("Failed. Is the backend running?"); }
    finally  { setLoading(false); }
  };

  return (
    <div className="rp-wrap fu">
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 7 }}>
          Repurpose existing content
        </p>
        <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.65 }}>
          Paste something you've already written. Pick a target format and get a natively adapted version —
          correct length, tone, and structure for the platform.
        </p>
      </div>

      {error && <div className="err" style={{ marginBottom: 16 }}>{error}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <span className="lbl">Your existing content</span>
          <textarea className="rp-ta" value={content} onChange={e => setContent(e.target.value)}
            placeholder="Paste your blog post, article, script, or any content here…" rows={6} />
        </div>

        <div>
          <span className="lbl">Convert to</span>
          <div className="rp-chips" style={{ marginBottom: 10 }}>
            {FORMATS.map(f => (
              <button key={f} type="button"
                onClick={() => { setTarget(f); setCustom(""); }}
                className={`rp-chip ${target === f ? "on" : ""}`}>
                {f}
              </button>
            ))}
          </div>
          <input type="text" value={custom} onChange={e => { setCustom(e.target.value); setTarget(""); }}
            className="rp-field" placeholder="Or type any format…" />
        </div>

        <div>
          <span className="lbl">Notes <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400, color: "var(--ink4)" }}>— optional</span></span>
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
            className="rp-field" placeholder="e.g. keep under 280 characters, include hashtags…" />
        </div>

        <button type="button" onClick={run}
          disabled={loading || !content.trim() || (!target && !custom.trim())}
          className="btn-teal" style={{ padding: "14px 0", fontSize: 14, width: "100%", justifyContent: "center" }}>
          {loading ? <><span className="sp" />Converting…</> : "Repurpose content →"}
        </button>
      </div>
    </div>
  );
}
