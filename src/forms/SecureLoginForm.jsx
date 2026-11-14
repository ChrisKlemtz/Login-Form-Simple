import { useEffect, useState } from "react";
import { isEmail, useFakeSubmit } from "../lib/form.js";

const DEMO = { email: "demo@tresor.example", password: "Sicher!2027" };

// Ab dem 2. Fehlversuch verdoppelt sich die Wartezeit: 2, 4, 8 ... höchstens 60 Sekunden.
const lockSeconds = (fails) => (fails < 2 ? 0 : Math.min(2 ** (fails - 1), 60));

const input =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 placeholder:text-slate-600 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30";

export default function SecureLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const [remember, setRemember] = useState(false);
  const [fails, setFails] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const [now, setNow] = useState(Date.now);
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(900);

  const remaining = Math.max(0, Math.ceil((lockUntil - now) / 1000));

  useEffect(() => {
    if (lockUntil <= Date.now()) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [lockUntil]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (remaining > 0) return;
    if (!isEmail(email) || !password) return setError("Bitte E-Mail und Passwort eingeben.");

    if (email.trim().toLowerCase() !== DEMO.email || password !== DEMO.password) {
      const count = fails + 1;
      setFails(count);
      setPassword("");
      setNow(Date.now());
      setLockUntil(Date.now() + lockSeconds(count) * 1000);
      // Bewusst dieselbe Meldung, egal ob E-Mail oder Passwort falsch ist.
      return setError("E-Mail oder Passwort ist nicht korrekt.");
    }
    setError("");
    setFails(0);
    await submit();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-xl font-black text-slate-950"
          >
            T
          </span>
          <span className="text-lg font-semibold">Tresor</span>
        </div>
        <h2 className="mt-8 text-2xl font-semibold">Anmelden</h2>
        <p className="mt-1 text-sm text-slate-400">Dein Passwort-Safe wartet.</p>

        {status === "done" ? (
          <div role="status" className="mt-6 rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-5">
            <p className="font-semibold text-emerald-300">Angemeldet.</p>
            <p className="mt-1 text-sm text-slate-300">
              {remember ? "Dieses Gerät bleibt 30 Tage angemeldet." : "Die Sitzung endet beim Schließen des Browsers."}
            </p>
            <button
              type="button"
              onClick={() => {
                setPassword("");
                reset();
              }}
              className="mt-3 text-sm underline"
            >
              Abmelden
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              E-Mail
              <input
                className={input}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <div>
              <label className="block text-sm text-slate-300">
                Passwort
                <div className="relative">
                  <input
                    className={`${input} pr-24`}
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={(e) => setCaps(e.getModifierState("CapsLock"))}
                  />
                  <button
                    type="button"
                    aria-pressed={show}
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 mt-0.5 -translate-y-1/2 rounded px-2 py-1 text-xs text-emerald-300 hover:bg-white/10"
                  >
                    {show ? "Verbergen" : "Anzeigen"}
                  </button>
                </div>
              </label>
              {caps && (
                <p role="status" className="mt-1 text-xs text-amber-300">
                  Die Feststelltaste ist aktiv.
                </p>
              )}
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                className="h-4 w-4 accent-emerald-400"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Auf diesem Gerät angemeldet bleiben
            </label>

            {error && (
              <p role="alert" className="text-sm text-red-300">
                {error}
              </p>
            )}
            {remaining > 0 && (
              <p role="status" className="rounded-lg bg-amber-400/10 p-3 text-sm text-amber-200">
                Fehlversuch {fails}. Nächster Versuch in <span className="tabular-nums">{remaining}</span> s.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending" || remaining > 0}
              className="w-full rounded-lg bg-emerald-400 px-5 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-50"
            >
              {status === "sending" ? "Wird geprüft …" : "Anmelden"}
            </button>
            <p className="border-t border-slate-800 pt-3 text-xs text-slate-500">
              Demo-Zugang: {DEMO.email} / {DEMO.password}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
