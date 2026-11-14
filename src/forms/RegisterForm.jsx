import { useState } from "react";
import { isEmail, useFakeSubmit } from "../lib/form.js";

const COMMON = ["password", "passwort", "123456", "qwertz", "qwerty", "hallo123", "111111"];

const RULES = [
  { label: "Mindestens 12 Zeichen", test: (p) => p.length >= 12 },
  { label: "Groß- und Kleinbuchstaben", test: (p) => /[a-zäöü]/.test(p) && /[A-ZÄÖÜ]/.test(p) },
  { label: "Mindestens eine Zahl", test: (p) => /\d/.test(p) },
  { label: "Mindestens ein Sonderzeichen", test: (p) => /[^\w\s]/.test(p) },
  {
    label: "Kein häufig verwendetes Passwort",
    test: (p) => p.length > 0 && !COMMON.some((c) => p.toLowerCase().includes(c)),
  },
];

const LEVELS = ["Sehr schwach", "Schwach", "Mittel", "Gut", "Stark", "Sehr stark"];
const COLORS = ["bg-slate-600", "bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-lime-400", "bg-emerald-400"];

const input =
  "mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit();

  const passed = RULES.map((rule) => rule.test(password));
  const score = passed.filter(Boolean).length;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) return setError("Bitte gib eine gültige E-Mail-Adresse ein.");
    if (score < RULES.length) return setError("Das Passwort erfüllt noch nicht alle Anforderungen.");
    if (password !== confirm) return setError("Die Passwörter stimmen nicht überein.");
    if (!terms) return setError("Bitte akzeptiere die Nutzungsbedingungen.");
    setError("");
    await submit();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
          <span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-indigo-300" />
          Orbit
        </div>
        <h2 className="mt-3 text-2xl font-semibold">Konto erstellen</h2>
        <p className="mt-1 text-sm text-slate-400">14 Tage kostenlos testen, keine Kreditkarte nötig.</p>

        {status === "done" ? (
          <div role="status" className="mt-6 rounded-lg bg-emerald-400/10 p-5 text-emerald-100">
            <p className="font-semibold">Willkommen bei Orbit.</p>
            <p className="mt-1 text-sm">Dein Konto für {email} wurde angelegt.</p>
            <button type="button" onClick={reset} className="mt-3 text-sm underline">
              Zurück zum Formular
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              E-Mail
              <input
                className={input}
                type="email"
                autoComplete="email"
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-pressed={show}
                    className="absolute right-2 top-1/2 mt-0.5 -translate-y-1/2 rounded px-2 py-1 text-xs text-indigo-300 hover:bg-white/10"
                  >
                    {show ? "Verbergen" : "Anzeigen"}
                  </button>
                </div>
              </label>
              <div className="mt-2 flex gap-1" aria-hidden="true">
                {RULES.map((rule, i) => (
                  <span
                    key={rule.label}
                    className={`h-1.5 flex-1 rounded-full ${i < score ? COLORS[score] : "bg-white/10"}`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-400" aria-live="polite">
                Stärke: {LEVELS[score]}
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                {RULES.map((rule, i) => (
                  <li key={rule.label} className={passed[i] ? "text-emerald-300" : "text-slate-400"}>
                    {passed[i] ? "✓" : "○"} {rule.label}
                  </li>
                ))}
              </ul>
            </div>

            <label className="block text-sm text-slate-300">
              Passwort wiederholen
              <input
                className={input}
                type={show ? "text" : "password"}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>

            <label className="flex gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-indigo-400"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              Ich akzeptiere die Nutzungsbedingungen.
            </label>

            {error && (
              <p role="alert" className="text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-indigo-500 px-5 py-2.5 font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
            >
              {status === "sending" ? "Konto wird angelegt …" : "Konto erstellen"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
