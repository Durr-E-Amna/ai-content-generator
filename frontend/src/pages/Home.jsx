import { useState } from "react";
import Navbar from "../components/Navbar";
import Landing from "../components/Landing";
import IntentCard from "../components/IntentCard";
import VersionPicker from "../components/VersionPicker";
import EditorView from "../components/EditorView";
import RepurposePanel from "../components/RepurposePanel";
import HistoryPanel, { saveToHistory } from "../components/HistoryPanel";
import { api } from "../api/generate";

const STEPS = [
  { id: "prompt",   label: "Describe" },
  { id: "intent",   label: "Confirm"  },
  { id: "versions", label: "Pick"     },
  { id: "editing",  label: "Edit"     },
];

function stepIndex(phase) {
  if (["prompt", "extracting"].includes(phase)) return 0;
  if (phase === "intent")                        return 1;
  if (["generating", "versions"].includes(phase)) return 2;
  if (phase === "editing")                       return 3;
  return 0;
}

const EXAMPLES = [
  "Write a professional blog post about how AI is changing the future of education for university students",
  "Create an inspirational LinkedIn post about overcoming failure as a startup founder, casual tone",
  "Write a funny Twitter thread about the struggles of being a developer at 2am",
];

export default function Home() {
  const [view,        setView]        = useState("landing");
  const [phase,       setPhase]       = useState("prompt");
  const [prompt,      setPrompt]      = useState("");
  const [intent,      setIntent]      = useState(null);
  const [vA,          setVA]          = useState("");
  const [vB,          setVB]          = useState("");
  const [loadA,       setLoadA]       = useState(false);
  const [loadB,       setLoadB]       = useState(false);
  const [content,     setContent]     = useState("");
  const [error,       setError]       = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const goHome = () => {
    setView("landing");
    resetFlow();
    setShowHistory(false);
  };

  const resetFlow = () => {
    setPhase("prompt"); setPrompt(""); setIntent(null);
    setVA(""); setVB(""); setContent(""); setError("");
  };

  // ── Extract intent ─────────────────────────────────────────────────────────
  const handleExtract = async () => {
    if (!prompt.trim()) return;
    setError(""); setPhase("extracting");
    try {
      const d = await api.extract(prompt);
      setIntent(d.intent);
      setPhase("intent");
    } catch {
      setError("Could not parse request. Is the backend running?");
      setPhase("prompt");
    }
  };

  // ── Generate both versions ─────────────────────────────────────────────────
  const handleConfirm = async (confirmedIntent) => {
    setIntent(confirmedIntent);
    setVA(""); setVB("");
    setLoadA(true); setLoadB(true);
    setPhase("generating");

    const [resA, resB] = await Promise.allSettled([
      api.generate(prompt, confirmedIntent, "A"),
      api.generate(prompt, confirmedIntent, "B"),
    ]);

    const outputA = resA.status === "fulfilled" ? resA.value.output : "Generation failed for Version A.";
    const outputB = resB.status === "fulfilled" ? resB.value.output : "Generation failed for Version B.";

    setVA(outputA); setLoadA(false);
    setVB(outputB); setLoadB(false);
    setPhase("versions");

    // Save both versions to history
    if (resA.status === "fulfilled") {
      saveToHistory(outputA, {
        content_type: (confirmedIntent.content_type || "Content") + " (A)",
        topic: confirmedIntent.topic || prompt.slice(0, 60),
      });
    }
    if (resB.status === "fulfilled") {
      saveToHistory(outputB, {
        content_type: (confirmedIntent.content_type || "Content") + " (B)",
        topic: confirmedIntent.topic || prompt.slice(0, 60),
      });
    }
  };

  // ── Pick version ───────────────────────────────────────────────────────────
  const handlePick = (text) => {
    setContent(text);
    setPhase("editing");
  };

  // ── Repurpose done ─────────────────────────────────────────────────────────
  const handleRepurposeDone = (text, fmt) => {
    setContent(text);
    setIntent({ content_type: "Repurposed → " + fmt, topic: fmt || "Repurposed content" });
    saveToHistory(text, {
      content_type: "Repurposed",
      topic: fmt || "Repurposed content",
    });
    setView("generate");
    setPhase("editing");
  };

  // ── Load from history ──────────────────────────────────────────────────────
  const handleHistoryLoad = (item) => {
    setContent(item.content || "");
    setIntent({
      content_type: item.contentType || "Content",
      topic: item.topic || "",
    });
    setPhase("editing");
    setView("generate");
    setShowHistory(false);
  };

  const curStep = stepIndex(phase);
  const showNav = view !== "landing";

  return (
    <>
      <Navbar
        onHome={goHome}
        showBack={showNav}
        onBack={goHome}
        onHistory={() => setShowHistory(h => !h)}
      />

      {/* History drawer */}
      {showHistory && (
        <HistoryPanel
          onLoad={handleHistoryLoad}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* ── LANDING ── */}
      {view === "landing" && (
        <Landing
          onGenerate={() => { setView("generate"); setPhase("prompt"); }}
          onRepurpose={() => setView("repurpose")}
        />
      )}

      {/* ── GENERATE FLOW ── */}
      {view === "generate" && (
        <div className="app-page">

          {/* Step bar — keys on fragments fixed */}
          <div className="stepbar">
            {STEPS.map((s, i) => (
              <span key={s.id} style={{ display: "contents" }}>
                <span className={`step-item ${i === curStep ? "active" : i < curStep ? "done" : ""}`}>
                  <span className="step-n">{i < curStep ? "✓" : i + 1}</span>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <span className="step-sep" />
                )}
              </span>
            ))}
          </div>

          {error && (
            <div className="err" style={{ marginBottom: 24 }}>{error}</div>
          )}

          {/* Step 1 — Prompt */}
          {(phase === "prompt" || phase === "extracting") && (
            <div className="prompt-screen fu">
              <h1 className="prompt-h">
                Describe what you<br />
                <em>want to create.</em>
              </h1>
              <p className="prompt-sub">
                Write naturally — include your topic, tone, audience, anything you want.
                The AI reads your intent and confirms it before generating.
              </p>

              <div className="prompt-box">
                <textarea
                  className="prompt-ta"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleExtract();
                  }}
                  placeholder="e.g. Write a professional blog post about how AI is transforming healthcare for medical professionals, around 800 words, authoritative but accessible tone…"
                  autoFocus
                />
                <div className="prompt-footer">
                  <span className="prompt-hint">Ctrl + Enter to analyse</span>
                  <button
                    type="button"
                    className="analyse-btn"
                    onClick={handleExtract}
                    disabled={!prompt.trim() || phase === "extracting"}
                  >
                    {phase === "extracting"
                      ? <><span className="sp" style={{ width: 13, height: 13 }} />Reading…</>
                      : "Analyse →"
                    }
                  </button>
                </div>
              </div>

              <div className="try-row">
                <span className="try-lbl">Try:</span>
                {EXAMPLES.map((ex, i) => (
                  <button key={i} type="button" className="try-chip" onClick={() => setPrompt(ex)}>
                    {ex.slice(0, 40)}…
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Intent confirm */}
          {phase === "intent" && intent && (
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <IntentCard
                intent={intent}
                onConfirm={handleConfirm}
                onBack={() => setPhase("prompt")}
                loading={false}
              />
            </div>
          )}

          {/* Step 3 — Version picker */}
          {(phase === "generating" || phase === "versions") && (
            <VersionPicker
              vA={vA} vB={vB}
              loadA={loadA} loadB={loadB}
              onPick={handlePick}
            />
          )}

          {/* Step 4 — Editor */}
          {phase === "editing" && (
            <EditorView
              content={content}
              intent={intent}
              onContentChange={setContent}
              onReset={() => { resetFlow(); setView("generate"); }}
            />
          )}
        </div>
      )}

      {/* ── REPURPOSE FLOW ── */}
      {view === "repurpose" && (
        <div className="app-page">
          <div className="stepbar" style={{ marginBottom: 32 }}>
            <span className="step-item active"><span className="step-n">1</span>Paste content</span>
            <span className="step-sep" />
            <span className="step-item"><span className="step-n">2</span>Pick format</span>
            <span className="step-sep" />
            <span className="step-item"><span className="step-n">3</span>Edit result</span>
          </div>
          <RepurposePanel onDone={handleRepurposeDone} />
        </div>
      )}
    </>
  );
}
