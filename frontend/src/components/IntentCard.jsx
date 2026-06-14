import { useState } from "react";

const TONES = ["Professional","Casual","Humorous","Inspirational","Authoritative","Empathetic","Urgent","Conversational","Witty","Formal"];
const AUDIENCES = ["Beginners","Students","Professionals","General public","Decision makers","Tech-savvy","Entrepreneurs","Creatives"];
const FORMATS = ["How-to guide","Opinion piece","Listicle","Narrative","Explainer","Case study","Step-by-step","Deep dive"];

function PillEditor({ values = [], options, onChange }) {
  const toggle = (v) => {
    const cur = values || [];
    onChange(cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="intent-pills">
        {(values || []).map(v => (
          <span key={v} className="ipill on">
            {v}
            <button type="button" onClick={() => toggle(v)}
              style={{ marginLeft: 5, background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: 12, lineHeight: 1, padding: 0 }}>
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="intent-pills">
        {options.filter(o => !(values || []).includes(o)).map(o => (
          <span key={o} className="ipill" onClick={() => toggle(o)} style={{ cursor: "pointer" }}>{o}</span>
        ))}
      </div>
    </div>
  );
}

export default function IntentCard({ intent, onConfirm, onBack, loading }) {
  const [data, setData] = useState({ ...intent });
  const [editing, setEditing] = useState(false);
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  return (
    <div className="intent-card fu">
      <div className="intent-hdr">
        <div className="intent-hdr-text">
          <h3>Here's what I understood</h3>
          <p>Review and edit anything — or confirm and generate two versions.</p>
        </div>
        <button type="button" className="btn-sm" onClick={() => setEditing(e => !e)}>
          {editing ? "Done editing" : "Edit details"}
        </button>
      </div>

      <div className="intent-body">
        <div className="intent-field">
          <span className="intent-lbl">Content type</span>
          {editing
            ? <input className="intent-input" value={data.content_type} onChange={e => set("content_type", e.target.value)} />
            : <span className="intent-val">{data.content_type}</span>}
        </div>

        <div className="intent-field" style={{ gridColumn: "1 / -1" }}>
          <span className="intent-lbl">Topic / title</span>
          {editing
            ? <input className="intent-input" value={data.topic} onChange={e => set("topic", e.target.value)} />
            : <span className="intent-val">{data.topic}</span>}
        </div>

        <div className="intent-field">
          <span className="intent-lbl">Tone {editing && <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— tap to add/remove</span>}</span>
          {editing
            ? <PillEditor values={data.tone} options={TONES} onChange={v => set("tone", v)} />
            : <div className="intent-pills">{(data.tone || []).map(t => <span key={t} className="ipill on">{t}</span>)}</div>}
        </div>

        <div className="intent-field">
          <span className="intent-lbl">Audience {editing && <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— tap to add/remove</span>}</span>
          {editing
            ? <PillEditor values={data.audience} options={AUDIENCES} onChange={v => set("audience", v)} />
            : <div className="intent-pills">{(data.audience || []).map(a => <span key={a} className="ipill on">{a}</span>)}</div>}
        </div>

        <div className="intent-field">
          <span className="intent-lbl">Format</span>
          {editing
            ? <PillEditor values={[data.format]} options={FORMATS} onChange={v => set("format", v[v.length - 1] || "")} />
            : <span className="intent-val">{data.format}</span>}
        </div>

        <div className="intent-field">
          <span className="intent-lbl">Platform <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--ink4)" }}>optional</span></span>
          {editing
            ? <input className="intent-input" value={data.platform || ""} onChange={e => set("platform", e.target.value)} placeholder="e.g. LinkedIn, Medium…" />
            : <span className="intent-val">{data.platform || <span style={{ color: "var(--ink4)", fontWeight: 400 }}>Not specified</span>}</span>}
        </div>

        <div className="intent-field">
          <span className="intent-lbl">Language</span>
          {editing
            ? <input className="intent-input" value={data.language || "English"} onChange={e => set("language", e.target.value)} />
            : <span className="intent-val">{data.language || "English"}</span>}
        </div>

        <div className="intent-field">
          <span className="intent-lbl">Word count <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--ink4)" }}>optional</span></span>
          {editing
            ? <input className="intent-input" value={data.word_count || ""} onChange={e => set("word_count", e.target.value)} placeholder="e.g. 800 words…" />
            : <span className="intent-val">{data.word_count || <span style={{ color: "var(--ink4)", fontWeight: 400 }}>Not specified</span>}</span>}
        </div>

        {(data.key_points || []).length > 0 && (
          <div className="intent-field" style={{ gridColumn: "1 / -1" }}>
            <span className="intent-lbl">Key points I'll cover</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {(data.key_points || []).map((kp, i) => <div key={i} className="intent-kp">{kp}</div>)}
            </div>
          </div>
        )}
      </div>

      <div className="intent-ftr" style={{ justifyContent: "space-between" }}>
        <button type="button" className="btn-ghost" onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          ← Edit my prompt
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {loading && <span style={{ fontSize: 12, color: "var(--ink4)" }}>~15 seconds</span>}
          <button type="button" onClick={() => onConfirm(data)} disabled={loading} className="btn-teal" style={{ padding: "11px 26px" }}>
            {loading
              ? <><span className="sp" />Generating…</>
              : <>Looks good — generate →</>}
          </button>
        </div>
      </div>
    </div>
  );
}
