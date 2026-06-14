import ReactMarkdown from "react-markdown";

function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9, padding: "4px 0" }}>
      {[88, 72, 95, 65, 80, 70, 90, 60, 85, 75].map((w, i) => (
        <div key={i} className="skel" style={{ height: 11, borderRadius: 5, width: `${w}%` }} />
      ))}
    </div>
  );
}

export default function VersionPicker({ vA, vB, loadA, loadB, onPick }) {
  return (
    <div className="fu">
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", fontFamily: "'Playfair Display',serif", marginBottom: 5 }}>
          Two versions ready
        </p>
        <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.6 }}>
          Version A is structured and direct. Version B takes a more creative angle.
          Scroll through both in full, then pick the one you want to edit.
        </p>
      </div>

      <div className="ver-grid">
        {[
          { key: "A", label: "Version A — Structured", badge: "ba", content: vA, loading: loadA },
          { key: "B", label: "Version B — Creative",   badge: "bb", content: vB, loading: loadB },
        ].map(({ key, label, badge, content, loading }) => (
          <div key={key} className={`ver-card fu${key === "B" ? "2" : ""}`}>
            <div className="ver-top">
              <span className={`ver-badge ${badge}`}>{label}</span>
              {loading && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--ink4)" }}>
                  <span className="sp sp-d" style={{ width: 11, height: 11 }} />
                  Generating…
                </span>
              )}
            </div>
            {/* Full scrollable body — no fade overlay */}
            <div className="ver-body">
              {loading
                ? <Skeleton />
                : <div className="prose" style={{ fontSize: 13.5, lineHeight: 1.7 }}>
                    <ReactMarkdown>{content || ""}</ReactMarkdown>
                  </div>
              }
            </div>
            <button
              type="button"
              onClick={() => onPick(content, key)}
              disabled={loading || !content}
              className="ver-action"
            >
              Use Version {key} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
