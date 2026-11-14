import { useRef, useState } from "react";
import { useFakeSubmit } from "../lib/form.js";

const WIDTH = 600;
const HEIGHT = 200;
const MIN_INK = 150; // Mindestlänge der Linie in Pixeln, ein Punkt ist keine Unterschrift

const CHECKS = ["Alle Kartons vollzählig angekommen", "Keine sichtbaren Schäden an Möbeln", "Wohnung besenrein übergeben"];

export default function SignatureForm() {
  const canvas = useRef(null);
  const last = useRef(null);
  const ink = useRef(0);
  const [signed, setSigned] = useState(false);
  const [typed, setTyped] = useState(false);
  const [name, setName] = useState("");
  const [checks, setChecks] = useState(CHECKS.map(() => false));
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(900);

  // Das Canvas wird per CSS skaliert, deshalb Mauskoordinaten auf die interne Größe umrechnen.
  const point = (e) => {
    const rect = canvas.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (WIDTH / rect.width),
      y: (e.clientY - rect.top) * (HEIGHT / rect.height),
    };
  };

  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    last.current = point(e);
  };

  const onMove = (e) => {
    if (!last.current) return;
    const next = point(e);
    const ctx = canvas.current.getContext("2d");
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    ink.current += Math.hypot(next.x - last.current.x, next.y - last.current.y);
    last.current = next;
    if (!signed && ink.current > MIN_INK) setSigned(true);
  };

  const onUp = () => {
    last.current = null;
  };

  const clear = () => {
    canvas.current?.getContext("2d").clearRect(0, 0, WIDTH, HEIGHT);
    ink.current = 0;
    setSigned(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (name.trim().split(/\s+/).length < 2) return setError("Bitte Vor- und Nachnamen angeben.");
    if (!checks.every(Boolean)) return setError("Bitte alle Punkte des Protokolls bestätigen.");
    if (!typed && !signed) return setError("Bitte im Feld unterschreiben.");
    setError("");
    setImage(typed ? "" : canvas.current.toDataURL("image/png"));
    await submit();
  };

  const restart = () => {
    ink.current = 0;
    setSigned(false);
    reset();
  };

  const today = new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex flex-1 items-center justify-center bg-amber-100 p-6 text-slate-900">
      <div className="w-full max-w-xl rounded-sm bg-[#fffdf7] p-8 shadow-xl ring-1 ring-amber-900/10">
        <div className="mx-auto -mt-12 mb-4 h-8 w-32 rounded-md bg-slate-600 shadow" aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Umzugshelden</p>
        <h2 className="mt-1 text-2xl font-bold">Übergabeprotokoll</h2>
        <p className="text-sm text-slate-600">Auftrag 2027-0613 · {today}</p>

        {status === "done" ? (
          <div role="status" className="mt-6">
            <p className="font-semibold">Protokoll unterschrieben.</p>
            <div className="mt-3 border-b-2 border-slate-900 pb-1">
              {image ? (
                <img src={image} alt={`Unterschrift von ${name}`} className="h-24" />
              ) : (
                <p className="font-serif text-4xl italic text-blue-900">{name}</p>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {name}, {today}
            </p>
            <button type="button" onClick={restart} className="mt-4 text-sm underline">
              Neues Protokoll
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
            <fieldset className="space-y-2">
              <legend className="text-sm font-bold">Bei der Übergabe geprüft</legend>
              {CHECKS.map((text, i) => (
                <label key={text} className="flex items-center gap-3 border-b border-dotted border-slate-300 pb-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-900"
                    checked={checks[i]}
                    onChange={(e) => setChecks(checks.map((c, j) => (j === i ? e.target.checked : c)))}
                  />
                  {text}
                </label>
              ))}
            </fieldset>

            <label className="block text-sm font-bold">
              Name in Druckbuchstaben
              <input
                className="mt-1 w-full border-0 border-b-2 border-slate-900 bg-transparent px-0 py-2 text-lg font-normal focus:border-blue-700 focus:outline-none focus:ring-0"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold" id="signature-label">
                  Unterschrift
                </p>
                {!typed && (
                  <button type="button" onClick={clear} disabled={!signed} className="text-sm underline disabled:opacity-40">
                    Löschen
                  </button>
                )}
              </div>

              {typed ? (
                <p className="mt-1 flex h-[120px] items-end border-b-2 border-slate-900 pb-2 font-serif text-4xl italic text-blue-900">
                  {name || " "}
                </p>
              ) : (
                <div className="relative mt-1">
                  <canvas
                    ref={canvas}
                    width={WIDTH}
                    height={HEIGHT}
                    role="img"
                    aria-labelledby="signature-label"
                    onPointerDown={onDown}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                    className="w-full cursor-crosshair touch-none rounded border-2 border-dashed border-slate-400 bg-white"
                  />
                  {!signed && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-400">
                      Hier mit Finger, Stift oder Maus unterschreiben
                    </span>
                  )}
                </div>
              )}

              <label className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-900"
                  checked={typed}
                  onChange={(e) => {
                    setTyped(e.target.checked);
                    ink.current = 0;
                    setSigned(false);
                  }}
                />
                Ich kann nicht zeichnen und unterschreibe mit meinem getippten Namen.
              </label>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded bg-blue-900 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {status === "sending" ? "Wird gespeichert …" : "Verbindlich unterschreiben"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
