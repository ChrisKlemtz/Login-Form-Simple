import { useRef, useState } from "react";

const MIN_AGE = 18;

const FIELDS = [
  { key: "day", label: "Tag", placeholder: "TT", length: 2, autoComplete: "bday-day" },
  { key: "month", label: "Monat", placeholder: "MM", length: 2, autoComplete: "bday-month" },
  { key: "year", label: "Jahr", placeholder: "JJJJ", length: 4, autoComplete: "bday-year" },
];

const ageOn = (day, month, year, today = new Date()) => {
  let age = today.getFullYear() - year;
  const hadBirthday = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);
  if (!hadBirthday) age -= 1;
  return age;
};

// new Date() korrigiert ungültige Tage still (31.02. wird zum 03.03.), deshalb der Rückvergleich.
const isRealDate = (day, month, year) => {
  const date = new Date(year, month - 1, day);
  return (
    year >= 1900 &&
    date <= new Date() &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export default function AgeGateForm() {
  const [values, setValues] = useState({ day: "", month: "", year: "" });
  const [result, setResult] = useState(null); // null | "ok" | "denied"
  const [error, setError] = useState("");
  const refs = useRef({});

  const onChange = (index, raw) => {
    const field = FIELDS[index];
    const value = raw.replace(/\D/g, "").slice(0, field.length);
    setValues((v) => ({ ...v, [field.key]: value }));
    if (value.length === field.length && index < FIELDS.length - 1) refs.current[FIELDS[index + 1].key]?.focus();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const day = Number(values.day);
    const month = Number(values.month);
    const year = Number(values.year);
    if (values.year.length < 4 || !isRealDate(day, month, year))
      return setError("Bitte ein gültiges Geburtsdatum eingeben.");
    setError("");
    // Gespeichert wird nur das Ergebnis, nicht das Geburtsdatum.
    setResult(ageOn(day, month, year) >= MIN_AGE ? "ok" : "denied");
    setValues({ day: "", month: "", year: "" });
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-[#3b0d1a] p-6 font-serif text-[#f5e9dc]">
      <div className="w-full max-w-md text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-[#d9a441]">Weingut Rebenhof</p>

        {result === "ok" && (
          <div role="status" className="mt-8">
            <h2 className="text-4xl">Willkommen.</h2>
            <p className="mt-3 font-sans text-[#f5e9dc]/80">Viel Freude beim Stöbern in unserem Keller.</p>
            <button type="button" onClick={() => setResult(null)} className="mt-6 font-sans text-sm underline">
              Demo neu starten
            </button>
          </div>
        )}

        {result === "denied" && (
          <div role="alert" className="mt-8">
            <h2 className="text-3xl">Leider noch nicht.</h2>
            <p className="mt-3 font-sans text-[#f5e9dc]/80">
              Unser Angebot richtet sich an Personen ab {MIN_AGE} Jahren. Wir dürfen dir den Shop nicht zeigen.
            </p>
            <button type="button" onClick={() => setResult(null)} className="mt-6 font-sans text-sm underline">
              Demo neu starten
            </button>
          </div>
        )}

        {result === null && (
          <form onSubmit={onSubmit} noValidate className="mt-8">
            <h2 className="text-4xl leading-tight">Wann bist du geboren?</h2>
            <p className="mt-3 font-sans text-sm text-[#f5e9dc]/80">
              Wir verkaufen Wein. Dafür müssen wir dein Alter prüfen.
            </p>

            <fieldset className="mt-8">
              <legend className="sr-only">Geburtsdatum</legend>
              <div className="flex justify-center gap-3 font-sans">
                {FIELDS.map((field, i) => (
                  <label key={field.key} className="text-xs uppercase tracking-widest text-[#d9a441]">
                    {field.label}
                    <input
                      ref={(el) => {
                        refs.current[field.key] = el;
                      }}
                      inputMode="numeric"
                      autoComplete={field.autoComplete}
                      placeholder={field.placeholder}
                      value={values[field.key]}
                      onChange={(e) => onChange(i, e.target.value)}
                      className={`mt-1 block border-0 border-b-2 border-[#d9a441]/60 bg-transparent py-2 text-center text-3xl tabular-nums text-[#f5e9dc] placeholder:text-[#f5e9dc]/25 focus:border-[#d9a441] focus:outline-none focus:ring-0 ${
                        field.length === 4 ? "w-28" : "w-16"
                      }`}
                    />
                  </label>
                ))}
              </div>
            </fieldset>

            {error && (
              <p role="alert" className="mt-4 font-sans text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-8 bg-[#d9a441] px-8 py-3 font-sans font-semibold uppercase tracking-widest text-[#3b0d1a] hover:bg-[#e8bb62]"
            >
              Eintreten
            </button>
            <p className="mt-5 font-sans text-xs text-[#f5e9dc]/60">
              Dein Geburtsdatum wird nicht gespeichert, nur das Ergebnis der Prüfung.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
