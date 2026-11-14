import { useMemo, useState } from "react";
import { isPhone, useFakeSubmit } from "../lib/form.js";

const SLOTS = ["08:30", "09:00", "09:45", "10:30", "11:15", "14:00", "14:45", "15:30", "16:15"];
const REASONS = ["Vorsorge", "Akute Beschwerden", "Impfung", "Rezept oder Überweisung"];

const nextWorkdays = (count) => {
  const days = [];
  const date = new Date();
  while (days.length < count) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) days.push(new Date(date));
  }
  return days;
};

// Ohne Backend: belegte Zeiten werden fest aus dem Datum abgeleitet.
const isTaken = (day, slotIndex) => (day.getDate() * 7 + slotIndex * 3) % 4 === 0;

const input =
  "mt-1 w-full rounded-xl border border-teal-900/15 bg-white px-3 py-2.5 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";

export default function AppointmentForm() {
  const days = useMemo(() => nextWorkdays(8), []);
  const [reason, setReason] = useState(REASONS[0]);
  const [dayIndex, setDayIndex] = useState(0);
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit();

  const day = days[dayIndex];
  const dayLabel = day.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!slot) return setError("Bitte wählen Sie eine Uhrzeit.");
    if (name.trim().length < 2) return setError("Bitte geben Sie Ihren Namen an.");
    if (!isPhone(phone)) return setError("Bitte geben Sie eine gültige Telefonnummer an.");
    setError("");
    await submit();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-teal-50 p-6 text-teal-950">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-teal-900/5">
        <p className="text-sm font-medium text-teal-700">Praxis am Stadtpark</p>
        <h2 className="mt-1 text-2xl font-semibold">Termin online buchen</h2>

        {status === "done" ? (
          <div role="status" className="mt-6 rounded-2xl bg-teal-50 p-6">
            <p className="font-semibold">Ihr Termin ist reserviert.</p>
            <p className="mt-1 text-sm">
              {reason} am {dayLabel} um {slot} Uhr. Bei Rückfragen rufen wir Sie unter {phone} an.
            </p>
            <button type="button" onClick={reset} className="mt-3 text-sm text-teal-700 underline">
              Weiteren Termin buchen
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-6">
            <label className="block text-sm font-medium">
              Anliegen
              <select className={input} value={reason} onChange={(e) => setReason(e.target.value)}>
                {REASONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>

            <fieldset>
              <legend className="text-sm font-medium">Tag</legend>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {days.map((d, i) => (
                  <label
                    key={d.toISOString()}
                    className={`cursor-pointer rounded-xl border p-2 text-center focus-within:ring-2 focus-within:ring-teal-600 ${
                      i === dayIndex ? "border-teal-600 bg-teal-600 text-white" : "border-teal-900/15"
                    }`}
                  >
                    <input
                      type="radio"
                      name="day"
                      className="sr-only"
                      checked={i === dayIndex}
                      onChange={() => {
                        setDayIndex(i);
                        setSlot("");
                      }}
                    />
                    <span className="block text-xs uppercase">
                      {d.toLocaleDateString("de-DE", { weekday: "short" })}
                    </span>
                    <span className="block text-lg font-semibold tabular-nums">
                      {d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-medium">Freie Zeiten am {dayLabel}</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {SLOTS.map((time, i) => {
                  const taken = isTaken(day, i);
                  return (
                    <label
                      key={time}
                      className={`rounded-xl border p-2 text-center text-sm tabular-nums focus-within:ring-2 focus-within:ring-teal-600 ${
                        taken
                          ? "cursor-not-allowed border-transparent bg-slate-100 text-slate-400 line-through"
                          : slot === time
                            ? "cursor-pointer border-teal-600 bg-teal-600 text-white"
                            : "cursor-pointer border-teal-900/15 hover:bg-teal-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        className="sr-only"
                        disabled={taken}
                        checked={slot === time}
                        onChange={() => setSlot(time)}
                      />
                      {time}
                      {taken && <span className="sr-only"> (belegt)</span>}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Name
                <input className={input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="block text-sm font-medium">
                Telefon
                <input
                  className={input}
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
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
              className="w-full rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {status === "sending" ? "Wird reserviert …" : "Termin verbindlich buchen"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
