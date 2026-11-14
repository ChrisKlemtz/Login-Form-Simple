import { useRef, useState } from "react";
import { euro, isEmail, useFakeSubmit } from "../lib/form.js";

const TICKETS = [
  { id: "student", label: "Student", price: 79 },
  { id: "standard", label: "Standard", price: 149 },
  { id: "vip", label: "VIP + Workshop", price: 349 },
];
const PROMO = { code: "COLLECTION10", factor: 0.9 };
const MAX_PEOPLE = 5;

const input =
  "w-full border-2 border-black bg-white px-3 py-2 font-medium placeholder:text-neutral-400 focus:bg-yellow-100 focus:outline-none";

export default function EventForm() {
  const nextId = useRef(2);
  const [ticket, setTicket] = useState("standard");
  const [people, setPeople] = useState([{ id: 1, name: "", email: "" }]);
  const [promo, setPromo] = useState("");
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(1100);

  const price = TICKETS.find((t) => t.id === ticket).price;
  const promoValid = promo.trim().toUpperCase() === PROMO.code;
  const total = price * people.length * (promoValid ? PROMO.factor : 1);

  const update = (id, key, value) =>
    setPeople((list) => list.map((p) => (p.id === id ? { ...p, [key]: value } : p)));

  const add = () => setPeople((list) => [...list, { id: nextId.current++, name: "", email: "" }]);
  const remove = (id) => setPeople((list) => list.filter((p) => p.id !== id));

  const onSubmit = async (e) => {
    e.preventDefault();
    const bad = people.findIndex((p) => p.name.trim().length < 2 || !isEmail(p.email));
    if (bad !== -1) return setError(`Bitte Name und gültige E-Mail für Person ${bad + 1} angeben.`);
    const emails = people.map((p) => p.email.trim().toLowerCase());
    if (new Set(emails).size !== emails.length) return setError("Jede Person braucht eine eigene E-Mail-Adresse.");
    if (promo.trim() && !promoValid) return setError("Der Rabattcode ist nicht gültig.");
    setError("");
    await submit();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-[#ff5a1f] p-6 text-black">
      <div className="w-full max-w-xl">
        <p className="text-sm font-black uppercase tracking-widest">12. bis 13. Juni 2027 · Hamburg</p>
        <h2 className="mt-2 text-6xl font-black uppercase leading-[0.9] tracking-tighter sm:text-7xl">
          Frontend
          <br />
          Fest
        </h2>

        {status === "done" ? (
          <div role="status" className="mt-8 border-4 border-black bg-white p-6">
            <p className="text-2xl font-black uppercase">Ihr seid dabei!</p>
            <p className="mt-2 font-medium">
              {people.length} Ticket(s) für {euro(total)}. Die Bestätigungen gehen an:{" "}
              {people.map((p) => p.email).join(", ")}
            </p>
            <button type="button" onClick={reset} className="mt-3 text-sm font-bold uppercase underline">
              Zurück zum Formular
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6 border-4 border-black bg-white p-6">
            <fieldset>
              <legend className="text-sm font-black uppercase">Ticket</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {TICKETS.map((t) => (
                  <label
                    key={t.id}
                    className={`cursor-pointer border-2 border-black p-3 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-black ${
                      ticket === t.id ? "bg-black text-white" : "hover:bg-yellow-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="ticket"
                      className="sr-only"
                      checked={ticket === t.id}
                      onChange={() => setTicket(t.id)}
                    />
                    <span className="block text-sm font-bold uppercase">{t.label}</span>
                    <span className="block text-2xl font-black tabular-nums">{t.price} €</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-black uppercase">
                Teilnehmende ({people.length} von {MAX_PEOPLE})
              </legend>
              <ul className="mt-2 space-y-2">
                {people.map((p, i) => (
                  <li key={p.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <input
                      className={input}
                      aria-label={`Name Person ${i + 1}`}
                      placeholder={`Name Person ${i + 1}`}
                      value={p.name}
                      onChange={(e) => update(p.id, "name", e.target.value)}
                    />
                    <input
                      className={input}
                      type="email"
                      aria-label={`E-Mail Person ${i + 1}`}
                      placeholder="E-Mail"
                      value={p.email}
                      onChange={(e) => update(p.id, "email", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      disabled={people.length === 1}
                      aria-label={`Person ${i + 1} entfernen`}
                      className="border-2 border-black px-3 py-2 font-black hover:bg-black hover:text-white disabled:opacity-30"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={add}
                disabled={people.length >= MAX_PEOPLE}
                className="mt-2 text-sm font-black uppercase underline disabled:opacity-40"
              >
                + Person hinzufügen
              </button>
            </fieldset>

            <label className="block text-sm font-black uppercase">
              Rabattcode (optional)
              <input
                className={`${input} mt-1 uppercase`}
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
              {promoValid && <span className="mt-1 block normal-case text-green-700">10 % Rabatt angewendet.</span>}
            </label>

            {error && (
              <p role="alert" className="font-bold text-red-700">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between border-t-4 border-black pt-4">
              <p aria-live="polite">
                <span className="block text-xs font-black uppercase">Gesamt</span>
                <span className="text-3xl font-black tabular-nums">{euro(total)}</span>
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-black px-6 py-4 font-black uppercase text-white hover:bg-[#ff5a1f] hover:text-black disabled:opacity-60"
              >
                {status === "sending" ? "Bucht …" : "Tickets buchen"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
