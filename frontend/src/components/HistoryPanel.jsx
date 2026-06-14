const KEY = "contentai_history";

export function saveToHistory(content, intent) {
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || "[]");
    const topic = intent?.topic || intent?.content_type || content.slice(0, 80) || "Untitled";
    const item = {
      id: Date.now(),
      content: content || "",
      contentType: intent?.content_type || "Content",
      topic: String(topic).slice(0, 80),
      wordCount: (content || "").trim().split(/\s+/).filter(Boolean).length,
      savedAt: new Date().toISOString(),
    };
    const updated = [item, ...existing].slice(0, 20);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("History save failed:", e);
  }
}

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch { return []; }
}

import { useEffect, useState } from "react";

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return (
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
      " · " +
      d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    );
  } catch { return ""; }
};

export default function HistoryPanel({ onLoad, onClose }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  const clearAll = () => {
    localStorage.removeItem(KEY);
    setItems([]);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.18)",
          zIndex: 290,
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: 340,
          background: "var(--white)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "-6px 0 32px rgba(0,0,0,0.10)",
          zIndex: 300,
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "18px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 17, fontWeight: 700, color: "var(--ink)",
            }}>
              History
            </p>
            <p style={{ fontSize: 11, color: "var(--ink4)", marginTop: 2 }}>
              {items.length} saved piece{items.length !== 1 ? "s" : ""} · this browser
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: "50%",
              border: "1.5px solid var(--border)",
              background: "var(--cream)",
              cursor: "pointer", fontSize: 18, color: "var(--ink3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "sans-serif", lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "56px 24px" }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "var(--cream2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, margin: "0 auto 14px",
              }}>
                📋
              </div>
              <p style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.65 }}>
                No history yet.
              </p>
              <p style={{ fontSize: 12, color: "var(--ink4)", lineHeight: 1.65, marginTop: 4 }}>
                Generated content is saved here automatically so you can return to any draft.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((item) => {
                const topicText = String(item.topic || item.contentType || "Untitled");
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onLoad(item)}
                    style={{
                      textAlign: "left", padding: "13px 14px",
                      borderRadius: 12,
                      border: "1.5px solid var(--border)",
                      background: "var(--cream)",
                      cursor: "pointer", transition: "all .15s",
                      fontFamily: "'Inter', sans-serif", width: "100%",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "var(--teal)";
                      e.currentTarget.style.background = "var(--teal-l)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.background = "var(--cream)";
                    }}
                  >
                    <div style={{
                      fontSize: 10, fontWeight: 700, color: "var(--teal)",
                      textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 5,
                    }}>
                      {item.contentType || "Content"}
                    </div>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: "var(--ink)",
                      lineHeight: 1.4, marginBottom: 7,
                    }}>
                      {topicText.length > 72 ? topicText.slice(0, 72) + "…" : topicText}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        padding: "2px 8px", borderRadius: 999,
                        background: "var(--teal-l)", color: "var(--teal)",
                      }}>
                        {item.wordCount || 0} words
                      </span>
                      <span style={{ fontSize: 11, color: "var(--ink4)" }}>
                        {formatDate(item.savedAt)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
            <button
              type="button"
              onClick={clearAll}
              style={{
                width: "100%", padding: "9px", borderRadius: 8,
                border: "1.5px solid var(--border)", background: "transparent",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12, fontWeight: 600, color: "var(--ink3)",
                cursor: "pointer", transition: "all .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#BE123C"; e.currentTarget.style.color = "#BE123C"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink3)"; }}
            >
              Clear all history
            </button>
          </div>
        )}
      </div>
    </>
  );
}
