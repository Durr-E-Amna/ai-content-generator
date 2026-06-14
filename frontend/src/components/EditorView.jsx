import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "../api/generate";

const SUGGESTIONS = [
  { l: "Stronger opening",    d: "Grab attention in the first line" },
  { l: "Make it shorter",     d: "Cut ~30%, keep all key points" },
  { l: "Make it longer",      d: "Expand with more detail" },
  { l: "Add real example",    d: "Concrete real-world case" },
  { l: "Punchier title",      d: "More impactful headline" },
  { l: "Simplify language",   d: "Accessible to general audience" },
  { l: "Add bullet points",   d: "Scannable lists" },
  { l: "More persuasive",     d: "Increase conviction" },
  { l: "Add data & stats",    d: "Strengthen with evidence" },
  { l: "Stronger conclusion", d: "Memorable takeaway" },
];

function Sidebar({ content, wordCount, intent, onRefined }) {
  const [custom,  setCustom]  = useState("");
  const [loading, setLoading] = useState("");
  const [error,   setError]   = useState("");

  const run = async (instruction) => {
    if (!instruction.trim() || !content) return;
    setLoading(instruction); setError("");
    try {
      const d = await api.refine(content, instruction);
      onRefined(d.output); setCustom("");
    } catch { setError("Failed. Is the backend running?"); }
    finally { setLoading(""); }
  };

  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="sidebar">
      {/* Custom instruction — TOP so always visible */}
      <div className="sc">
        <span className="sc-title">Custom instruction</span>
        <input
          type="text"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => e.key === "Enter" && run(custom)}
          disabled={!!loading || !content}
          placeholder='Type any instruction and press Enter…'
          className="refinp"
        />
        <button
          type="button"
          onClick={() => run(custom)}
          disabled={!!loading || !custom.trim() || !content}
          className="refbtn"
        >
          {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><span className="sp" style={{ width: 13, height: 13 }} />Applying…</span> : "Apply"}
        </button>
      </div>

      {/* Stats */}
      <div className="sc">
        <span className="sc-title">Stats</span>
        <div className="meta-row">
          <span className="mc mc-g">{wordCount} words</span>
          <span className="mc">~{readTime} min read</span>
          {(intent?.tone || []).map(t => <span key={t} className="mc">{t}</span>)}
          {intent?.platform && <span className="mc">{intent.platform}</span>}
          {intent?.language && intent.language !== "English" && <span className="mc">{intent.language}</span>}
        </div>
      </div>

      {/* Suggestions */}
      <div className="sc">
        <span className="sc-title">Quick edits</span>
        {error && <p style={{ fontSize: 11, color: "#BE123C" }}>{error}</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {SUGGESTIONS.map(s => {
            const isActive = loading === s.l;
            return (
              <button
                key={s.l}
                type="button"
                onClick={() => run(s.l)}
                disabled={!!loading || !content}
                className="sug"
                style={isActive ? { borderColor: "var(--teal)", background: "var(--teal-l)" } : {}}
              >
                <span className="sug-l">
                  {isActive && <span className="sp sp-d" style={{ width: 11, height: 11 }} />}
                  {s.l}
                </span>
                <span className="sug-d">{s.d}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function EditorView({ content, intent, onContentChange, onReset }) {
  const [edited, setEdited]   = useState(content);
  const [mode,   setMode]     = useState("preview");
  const [copied, setCopied]   = useState(false);

  useEffect(() => { setEdited(content); }, [content]);

  const wordCount = edited.trim() ? edited.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleRefined = (v) => { setEdited(v); onContentChange?.(v); };

  const copy = () => {
    navigator.clipboard.writeText(edited);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([edited], { type: "text/markdown" })),
      download: "content.md",
    });
    a.click();
  };

  return (
    <div className="fu">
      {/* Top action bar — Start new piece is prominent here */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>
          Your content
        </p>
        <button
          type="button"
          onClick={onReset}
          className="btn-teal"
          style={{ padding: "9px 20px", fontSize: 13 }}
        >
          + New piece
        </button>
      </div>

      <div className="editor-wrap">
        {/* Main editor — shown first, left */}
        <div className="editor-card">
          <div className="editor-bar">
            <div className="mode-toggle">
              <button className={`mode-btn ${mode === "preview" ? "on" : ""}`} onClick={() => setMode("preview")}>Preview</button>
              <button className={`mode-btn ${mode === "edit"    ? "on" : ""}`} onClick={() => setMode("edit")}>Edit raw</button>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn-sm" onClick={copy}>{copied ? "✓ Copied" : "Copy"}</button>
              <button className="btn-sm" onClick={download}>Download .md</button>
            </div>
          </div>

          <div className="editor-body">
            {mode === "preview"
              ? <div className="prose fu"><ReactMarkdown>{edited}</ReactMarkdown></div>
              : <textarea className="raw-edit fu" value={edited} onChange={e => { setEdited(e.target.value); onContentChange?.(e.target.value); }} spellCheck={false} />
            }
          </div>
        </div>

        {/* Sidebar — right */}
        <Sidebar
          content={edited}
          wordCount={wordCount}
          intent={intent}
          onRefined={handleRefined}
        />
      </div>
    </div>
  );
}
