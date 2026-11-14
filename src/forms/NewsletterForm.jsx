import { useState } from "react";
import Honeypot from "../components/Honeypot.jsx";
import { isEmail, useFakeSubmit } from "../lib/form.js";

const input =
  "mt-1 w-full rounded-none border-0 border-b-2 border-stone-400 bg-transparent px-0 py-2 text-lg text-stone-900 placeholder:text-stone-400 focus:border-amber-800 focus:outline-none focus:ring-0";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [caught, setCaught] = useState(false);
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) return setError("Bitte gib eine gültige E-Mail-Adresse ein.");
    if (!consent) return setError("Bitte bestätige deine Einwilligung.");
    setError("");
    // Ein Bot bekommt dieselbe Erfolgsmeldung, der Eintrag wird aber verworfen.
    setCaught(trap !== "");
    await submit();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-[#f3ead9] p-6 font-serif text-stone-900">
      <div className="w-full max-w-md">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-900">Röstwerk Kaffee</p>
        <h2 className="mt-3 text-4xl leading-tight">Post aus der Rösterei, einmal im Monat.</h2>
        <p className="mt-3 text-stone-700">
          Neue Ernten, Brühtipps und 10 % auf deine erste Bestellung.
        </p>

        {status === "done" ? (
          <div role="status" className="mt-8 border-l-4 border-amber-800 bg-white/60 p-5">
            <p className="text-xl">Fast geschafft.</p>
            <p className="mt-2 text-stone-700">
              Wir haben eine Bestätigungs-Mail an <strong>{email}</strong> geschickt. Erst mit dem Klick auf
              den Link bist du angemeldet.
            </p>
            {caught && (
              <p className="mt-3 rounded bg-amber-100 p-3 font-sans text-sm text-amber-950">
                Demo-Hinweis: Der Honeypot war ausgefüllt. Diese Anmeldung würde still verworfen, der Bot
                sieht trotzdem die Erfolgsmeldung.
              </p>
            )}
            <button type="button" onClick={reset} className="mt-4 font-sans text-sm underline">
              Zurück zum Formular
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="relative mt-8 space-y-5">
            <Honeypot value={trap} onChange={setTrap} />
            <label className="block font-sans text-sm text-stone-600">
              Vorname (optional)
              <input
                className={input}
                type="text"
                autoComplete="given-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block font-sans text-sm text-stone-600">
              E-Mail-Adresse
              <input
                className={input}
                type="email"
                autoComplete="email"
                placeholder="du@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="flex gap-3 font-sans text-sm text-stone-700">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-amber-800"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                Ich möchte den Newsletter erhalten und kann mich jederzeit wieder abmelden.
              </span>
            </label>
            {error && (
              <p role="alert" className="font-sans text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-stone-900 px-6 py-3 font-sans font-medium text-[#f3ead9] hover:bg-amber-900 disabled:opacity-60"
            >
              {status === "sending" ? "Wird gesendet …" : "Anmelden"}
            </button>
            <label className="flex items-center gap-2 font-sans text-xs text-stone-500">
              <input
                type="checkbox"
                className="accent-stone-600"
                checked={trap !== ""}
                onChange={(e) => setTrap(e.target.checked ? "https://spam.example" : "")}
              />
              Demo: als Bot absenden (füllt das versteckte Feld aus)
            </label>
          </form>
        )}
      </div>
    </div>
  );
}
