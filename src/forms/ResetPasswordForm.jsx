import { useRef, useState } from "react";
import { isEmail, useFakeSubmit } from "../lib/form.js";

const THUMB = 48;
const MIN_DRAG_MS = 250;

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [slide, setSlide] = useState(0);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const startedAt = useRef(0);
  const { status, submit, reset } = useFakeSubmit(1000);

  const onSlide = (e) => {
    if (verified) return;
    const value = Number(e.target.value);
    if (slide === 0 && value > 0) startedAt.current = Date.now();
    if (value < 100) return setSlide(value);
    // Ein Sprung auf 100 in wenigen Millisekunden deutet auf ein Skript hin.
    if (Date.now() - startedAt.current < MIN_DRAG_MS) {
      setSlide(0);
      return setError("Das war zu schnell. Bitte den Regler ziehen.");
    }
    setError("");
    setSlide(100);
    setVerified(true);
  };

  const release = () => {
    if (!verified) setSlide(0);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) return setError("Bitte gib eine gültige E-Mail-Adresse ein.");
    if (!verified) return setError("Bitte zieh den Regler ganz nach rechts.");
    setError("");
    await submit();
  };

  const restart = () => {
    setSlide(0);
    setVerified(false);
    reset();
  };

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-slate-900 p-6 text-white">
      <div aria-hidden="true" className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-cyan-400/50 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-fuchsia-500/50 blur-3xl" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/25 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <p className="text-sm font-semibold text-white/80">Lumen Cloud</p>
        <h2 className="mt-2 text-2xl font-semibold">Passwort zurücksetzen</h2>

        {status === "done" ? (
          <div role="status" className="mt-6">
            <p className="text-white/90">
              Falls zu <strong>{email}</strong> ein Konto existiert, haben wir einen Link zum Zurücksetzen
              geschickt. Er ist 30 Minuten gültig.
            </p>
            <button type="button" onClick={restart} className="mt-4 text-sm underline">
              Zurück zum Formular
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
            <p className="text-sm text-white/80">Gib deine E-Mail-Adresse ein, wir schicken dir einen Link.</p>
            <label className="block text-sm text-white/90">
              E-Mail
              <input
                type="email"
                autoComplete="email"
                className="mt-1 w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                placeholder="du@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <div>
              <p className="text-sm text-white/90" id="slide-label">
                Sicherheitsprüfung
              </p>
              <div className="relative mt-1 h-12 overflow-hidden rounded-xl border border-white/25 bg-white/10 focus-within:ring-2 focus-within:ring-white/60">
                <div
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 ${verified ? "bg-emerald-400/70" : "bg-white/25"}`}
                  style={{ width: `calc(${slide}% + ${THUMB * (1 - slide / 100)}px)` }}
                />
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-sm">
                  {verified ? "Bestätigt" : "Zum Bestätigen nach rechts ziehen"}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute top-0 flex h-full items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-900 shadow"
                  style={{ width: THUMB, left: `calc(${slide}% - ${(THUMB * slide) / 100}px)` }}
                >
                  {verified ? "✓" : "→"}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  aria-labelledby="slide-label"
                  aria-valuetext={verified ? "Bestätigt" : `${slide} Prozent`}
                  disabled={verified}
                  value={slide}
                  onChange={onSlide}
                  onPointerUp={release}
                  onTouchEnd={release}
                  className="absolute inset-0 h-full w-full cursor-grab opacity-0 disabled:cursor-default"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-amber-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-white/90 disabled:opacity-60"
            >
              {status === "sending" ? "Wird gesendet …" : "Link anfordern"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
