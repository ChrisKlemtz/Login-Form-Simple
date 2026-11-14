import { useState } from "react";

const CATEGORIES = [
  {
    id: "necessary",
    label: "Notwendig",
    locked: true,
    text: "Warenkorb, Anmeldung und Sicherheit. Ohne diese Funktionen läuft der Shop nicht.",
  },
  { id: "stats", label: "Statistik", text: "Anonyme Auswertung, welche Seiten wie oft besucht werden." },
  { id: "marketing", label: "Marketing", text: "Anzeigen auf anderen Websites, die zu deinen Interessen passen." },
  { id: "media", label: "Externe Medien", text: "Videos und Karten von Drittanbietern direkt auf der Seite." },
];

// Ohne Einwilligung ist nichts vorausgewählt außer dem technisch Notwendigen.
const NONE = { necessary: true, stats: false, marketing: false, media: false };
const ALL = { necessary: true, stats: true, marketing: true, media: true };

// Alle drei Buttons sehen gleich aus: Ablehnen darf nicht schwerer sein als Zustimmen.
const button =
  "flex-1 rounded-lg border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

export default function ConsentForm() {
  const [choice, setChoice] = useState(NONE);
  const [saved, setSaved] = useState(null);

  const save = (value) => {
    setChoice(value);
    setSaved({ value, at: new Date() });
  };

  const active = saved ? CATEGORIES.filter((c) => saved.value[c.id]).map((c) => c.label) : [];

  return (
    <div className="relative flex flex-1 items-end justify-center overflow-hidden bg-slate-200 p-4 sm:items-center sm:p-6">
      <div aria-hidden="true" className="absolute inset-0 space-y-4 p-8 opacity-60 blur-[2px]">
        <div className="h-10 w-48 rounded bg-slate-400" />
        <div className="h-48 rounded-xl bg-slate-300" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-40 rounded-xl bg-slate-300" />
          <div className="h-40 rounded-xl bg-slate-300" />
          <div className="h-40 rounded-xl bg-slate-300" />
        </div>
      </div>

      {saved ? (
        <div role="status" className="relative w-full max-w-lg rounded-2xl bg-white p-6 text-slate-900 shadow-2xl">
          <h2 className="text-lg font-bold">Auswahl gespeichert</h2>
          <p className="mt-2 text-sm text-slate-700">Aktiv: {active.join(", ")}.</p>
          <p className="mt-1 text-sm text-slate-500">
            Gespeichert am {saved.at.toLocaleDateString("de-DE")} um{" "}
            {saved.at.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr.
          </p>
          <button type="button" onClick={() => setSaved(null)} className="mt-4 text-sm font-semibold underline">
            Einstellungen ändern
          </button>
        </div>
      ) : (
        <form
          aria-labelledby="consent-title"
          onSubmit={(e) => {
            e.preventDefault();
            save(choice);
          }}
          className="relative w-full max-w-lg rounded-2xl bg-white p-6 text-slate-900 shadow-2xl"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Hofladen Online</p>
          <h2 id="consent-title" className="mt-1 text-xl font-bold">
            Deine Privatsphäre, deine Entscheidung
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Wir nutzen Cookies. Notwendige sind immer aktiv, über alle anderen entscheidest du.
          </p>

          <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {CATEGORIES.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <label htmlFor={`consent-${c.id}`} className="font-semibold">
                    {c.label}
                  </label>
                  <p id={`consent-${c.id}-text`} className="text-sm text-slate-600">
                    {c.text}
                  </p>
                </div>
                <span className="relative mt-1 inline-flex h-6 w-11 shrink-0">
                  <input
                    id={`consent-${c.id}`}
                    type="checkbox"
                    role="switch"
                    aria-describedby={`consent-${c.id}-text`}
                    disabled={c.locked}
                    checked={choice[c.id]}
                    onChange={(e) => setChoice({ ...choice, [c.id]: e.target.checked })}
                    className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  />
                  <span
                    aria-hidden="true"
                    className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-slate-900 peer-focus-visible:ring-2 peer-focus-visible:ring-slate-900 peer-focus-visible:ring-offset-2 peer-disabled:opacity-50"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5"
                  />
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => save(NONE)} className={button}>
              Alle ablehnen
            </button>
            <button type="submit" className={button}>
              Auswahl speichern
            </button>
            <button type="button" onClick={() => save(ALL)} className={button}>
              Alle akzeptieren
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
