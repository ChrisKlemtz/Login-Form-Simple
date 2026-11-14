import { useEffect, useState } from "react";

const CONFIRM_WORD = "LÖSCHEN";
const DEMO_PASSWORD = "notizwerk";
const UNDO_SECONDS = 8;

const CHECKS = [
  "Alle 214 Notizen und 12 Notizbücher werden endgültig gelöscht.",
  "Mein Abo endet sofort, eine Erstattung gibt es nicht.",
];

const input =
  "mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20";

export default function DeleteAccountForm() {
  const [checked, setChecked] = useState(CHECKS.map(() => false));
  const [word, setWord] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState("form"); // form | pending | deleted
  const [seconds, setSeconds] = useState(UNDO_SECONDS);

  const ready = checked.every(Boolean) && word === CONFIRM_WORD && password.length > 0;

  // Schonfrist: Die Löschung lässt sich einige Sekunden lang abbrechen.
  useEffect(() => {
    if (phase !== "pending") return;
    if (seconds <= 0) return setPhase("deleted");
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, seconds]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!ready) return;
    if (password !== DEMO_PASSWORD) {
      setPassword("");
      return setError("Das Passwort ist nicht korrekt.");
    }
    setError("");
    setSeconds(UNDO_SECONDS);
    setPhase("pending");
  };

  const restart = () => {
    setChecked(CHECKS.map(() => false));
    setWord("");
    setPassword("");
    setPhase("form");
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-neutral-100 p-6 text-neutral-900">
      <div className="w-full max-w-lg">
        <p className="text-sm text-neutral-500">Notizwerk · Einstellungen · Konto</p>

        <div className="mt-3 rounded-lg border-2 border-red-600 bg-white">
          <div className="border-b border-red-200 bg-red-50 px-5 py-3">
            <h2 className="text-lg font-bold text-red-800">Konto endgültig löschen</h2>
          </div>

          {phase === "deleted" && (
            <div role="status" className="p-5">
              <p className="font-semibold">Das Konto wurde gelöscht (simuliert).</p>
              <p className="mt-1 text-sm text-neutral-600">Eine Bestätigung geht an die hinterlegte E-Mail-Adresse.</p>
              <button type="button" onClick={restart} className="mt-3 text-sm underline">
                Demo neu starten
              </button>
            </div>
          )}

          {phase === "pending" && (
            <div role="alert" className="p-5">
              <p className="font-semibold">
                Das Konto wird in <span className="tabular-nums">{seconds}</span> Sekunden gelöscht.
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-red-100" aria-hidden="true">
                <div
                  className="h-full bg-red-600 transition-all duration-1000 ease-linear"
                  style={{ width: `${(seconds / UNDO_SECONDS) * 100}%` }}
                />
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setPhase("form")}
                className="mt-4 rounded-md border-2 border-neutral-900 px-4 py-2 font-semibold hover:bg-neutral-900 hover:text-white"
              >
                Abbrechen, Konto behalten
              </button>
            </div>
          )}

          {phase === "form" && (
            <form onSubmit={onSubmit} noValidate className="space-y-5 p-5">
              <p className="text-sm text-neutral-700">
                Dieser Schritt lässt sich nicht rückgängig machen. Bitte bestätige, dass du die Folgen kennst.
              </p>

              <fieldset className="space-y-2">
                <legend className="sr-only">Folgen bestätigen</legend>
                {CHECKS.map((text, i) => (
                  <label key={text} className="flex gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-red-600"
                      checked={checked[i]}
                      onChange={(e) => setChecked(checked.map((c, j) => (j === i ? e.target.checked : c)))}
                    />
                    {text}
                  </label>
                ))}
              </fieldset>

              <label className="block text-sm font-medium">
                Tippe zur Bestätigung <strong className="font-mono">{CONFIRM_WORD}</strong>
                <input
                  className={`${input} font-mono`}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                />
              </label>

              <label className="block text-sm font-medium">
                Passwort erneut eingeben
                <input
                  className={input}
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              {error && (
                <p role="alert" className="text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={!ready}
                  className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
                >
                  Konto löschen
                </button>
                <span className="text-xs text-neutral-500">Demo-Passwort: {DEMO_PASSWORD}</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
