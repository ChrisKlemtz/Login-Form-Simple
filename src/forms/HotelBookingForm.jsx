import { useState } from "react";
import { euro, isEmail, useFakeSubmit } from "../lib/form.js";

const ROOMS = [
  { id: "classic", label: "Classic", price: 129, capacity: 2 },
  { id: "lake", label: "Seeblick", price: 189, capacity: 3 },
  { id: "suite", label: "Suite", price: 289, capacity: 5 },
];
const BREAKFAST = 18;
const MAX_NIGHTS = 14;

const iso = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// Mittags rechnen, damit die Zeitumstellung keinen Tag verschiebt.
const at = (isoDate) => new Date(`${isoDate}T12:00:00`);
const addDays = (isoDate, days) => {
  const date = at(isoDate);
  date.setDate(date.getDate() + days);
  return iso(date);
};

const input =
  "mt-1 w-full border border-[#c8b27a]/50 bg-[#102a23] px-3 py-2.5 text-[#f3ead7] [color-scheme:dark] focus:border-[#c8b27a] focus:outline-none focus:ring-1 focus:ring-[#c8b27a]";

function Stepper({ label, value, min, max, onChange }) {
  const button =
    "h-10 w-10 border border-[#c8b27a]/50 text-xl hover:bg-[#c8b27a] hover:text-[#0b1f1a] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit";
  return (
    <div>
      <p className="text-sm">{label}</p>
      <div className="mt-1 flex items-center gap-3">
        <button type="button" className={button} disabled={value <= min} onClick={() => onChange(value - 1)} aria-label={`${label} verringern`}>
          −
        </button>
        <output className="w-6 text-center text-xl tabular-nums" aria-live="polite">
          {value}
        </output>
        <button type="button" className={button} disabled={value >= max} onClick={() => onChange(value + 1)} aria-label={`${label} erhöhen`}>
          +
        </button>
      </div>
    </div>
  );
}

export default function HotelBookingForm() {
  const [today] = useState(() => iso(new Date()));
  const [checkIn, setCheckIn] = useState(() => addDays(iso(new Date()), 7));
  const [checkOut, setCheckOut] = useState(() => addDays(iso(new Date()), 9));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [room, setRoom] = useState("lake");
  const [breakfast, setBreakfast] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(1200);

  const guests = adults + children;
  const selected = ROOMS.find((r) => r.id === room);
  const nights = checkIn && checkOut ? Math.round((at(checkOut) - at(checkIn)) / 86400000) : 0;
  const total = nights > 0 ? nights * (selected.price + (breakfast ? BREAKFAST * guests : 0)) : 0;

  const onCheckIn = (value) => {
    setCheckIn(value);
    // Abreise automatisch nachziehen, wenn sie nicht mehr nach der Anreise liegt.
    if (value && (!checkOut || checkOut <= value)) setCheckOut(addDays(value, 1));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return setError("Bitte An- und Abreise wählen.");
    if (checkIn < today) return setError("Die Anreise liegt in der Vergangenheit.");
    if (nights < 1) return setError("Die Abreise muss nach der Anreise liegen.");
    if (nights > MAX_NIGHTS) return setError(`Online sind höchstens ${MAX_NIGHTS} Nächte buchbar.`);
    if (guests > selected.capacity)
      return setError(`Das Zimmer „${selected.label}“ bietet Platz für höchstens ${selected.capacity} Personen.`);
    if (name.trim().length < 3) return setError("Bitte Ihren Namen angeben.");
    if (!isEmail(email)) return setError("Bitte eine gültige E-Mail-Adresse angeben.");
    setError("");
    await submit();
  };

  const fmt = (isoDate) => at(isoDate).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex flex-1 items-center justify-center bg-[#0b1f1a] p-6 font-serif text-[#f3ead7]">
      <div className="w-full max-w-xl">
        <p className="text-center text-xs uppercase tracking-[0.5em] text-[#c8b27a]">Hotel Seeblick · seit 1924</p>
        <h2 className="mt-3 text-center text-4xl">Ihr Aufenthalt</h2>

        {status === "done" ? (
          <div role="status" className="mt-8 border border-[#c8b27a]/50 p-6 text-center">
            <p className="text-2xl text-[#c8b27a]">Wir freuen uns auf Sie.</p>
            <p className="mt-2">
              {selected.label}, {fmt(checkIn)} bis {fmt(checkOut)} ({nights} {nights === 1 ? "Nacht" : "Nächte"}),{" "}
              {guests} {guests === 1 ? "Gast" : "Gäste"}. Gesamt {euro(total)}.
            </p>
            <button type="button" onClick={reset} className="mt-4 font-sans text-sm underline">
              Buchung ändern
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6 font-sans">
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm">
                Anreise
                <input className={input} type="date" min={today} value={checkIn} onChange={(e) => onCheckIn(e.target.value)} />
              </label>
              <label className="block text-sm">
                Abreise
                <input
                  className={input}
                  type="date"
                  min={checkIn ? addDays(checkIn, 1) : today}
                  max={checkIn ? addDays(checkIn, MAX_NIGHTS) : undefined}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </label>
            </div>

            <div className="flex gap-10">
              <Stepper label="Erwachsene" value={adults} min={1} max={4} onChange={setAdults} />
              <Stepper label="Kinder" value={children} min={0} max={3} onChange={setChildren} />
            </div>

            <fieldset>
              <legend className="text-sm">Zimmer</legend>
              <div className="mt-1 grid gap-2 sm:grid-cols-3">
                {ROOMS.map((r) => (
                  <label
                    key={r.id}
                    className={`cursor-pointer border p-3 focus-within:ring-1 focus-within:ring-[#c8b27a] ${
                      room === r.id ? "border-[#c8b27a] bg-[#c8b27a] text-[#0b1f1a]" : "border-[#c8b27a]/50"
                    }`}
                  >
                    <input type="radio" name="room" className="sr-only" checked={room === r.id} onChange={() => setRoom(r.id)} />
                    <span className="block font-serif text-lg">{r.label}</span>
                    <span className="block text-sm tabular-nums">
                      {r.price} € pro Nacht · bis {r.capacity} Pers.
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#c8b27a]"
                checked={breakfast}
                onChange={(e) => setBreakfast(e.target.checked)}
              />
              Frühstück ({BREAKFAST} € pro Person und Nacht)
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                Name
                <input className={input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="block text-sm">
                E-Mail
                <input className={input} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between border-t border-[#c8b27a]/50 pt-5">
              <p aria-live="polite">
                <span className="block text-xs uppercase tracking-widest text-[#c8b27a]">
                  {nights > 0 ? `${nights} ${nights === 1 ? "Nacht" : "Nächte"}` : "Zeitraum wählen"}
                </span>
                <span className="font-serif text-3xl tabular-nums">{euro(total)}</span>
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-[#c8b27a] px-6 py-3 font-semibold uppercase tracking-widest text-[#0b1f1a] hover:bg-[#dccb98] disabled:opacity-60"
              >
                {status === "sending" ? "Wird gebucht …" : "Buchen"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
