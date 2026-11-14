import { useState } from "react";
import { useFakeSubmit } from "../lib/form.js";

const newCaptcha = () => ({ a: 2 + Math.floor(Math.random() * 8), b: 1 + Math.floor(Math.random() * 9) });
const newTicketId = () => `#${Math.floor(100000 + Math.random() * 900000)}`;

const PRIORITIES = [
  { value: "low", label: "niedrig" },
  { value: "normal", label: "normal" },
  { value: "high", label: "dringend" },
];

const input =
  "mt-1 w-full border border-green-500/40 bg-black px-3 py-2 text-green-300 placeholder:text-green-800 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400";

export default function SupportTicketForm() {
  const [values, setValues] = useState({ customer: "", category: "Server", priority: "normal", text: "" });
  const [captcha, setCaptcha] = useState(newCaptcha);
  const [answer, setAnswer] = useState("");
  const [ticket, setTicket] = useState("");
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(1000);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^KD-\d{5}$/.test(values.customer.trim())) return setError("Kundennummer im Format KD-12345 angeben.");
    if (values.text.trim().length < 30) return setError("Bitte das Problem mit mindestens 30 Zeichen beschreiben.");
    if (Number(answer) !== captcha.a + captcha.b || answer === "") {
      // Nach einem Fehlversuch gibt es eine neue Aufgabe.
      setCaptcha(newCaptcha());
      setAnswer("");
      return setError("Sicherheitsfrage falsch beantwortet. Neue Aufgabe geladen.");
    }
    setError("");
    setTicket(newTicketId());
    await submit();
  };

  const again = () => {
    setCaptcha(newCaptcha());
    setAnswer("");
    reset();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-black p-6 font-mono text-green-400">
      <div className="w-full max-w-xl border border-green-500/40">
        <div className="flex items-center justify-between border-b border-green-500/40 px-4 py-2 text-xs">
          <span>kernel-hosting :: support</span>
          <span aria-hidden="true">● ● ●</span>
        </div>
        <div className="p-6">
          <h2 className="text-xl">
            <span aria-hidden="true">$ </span>ticket --new
          </h2>
          <p className="mt-1 text-sm text-green-700">Antwortzeit: dringend 1 h, normal 8 h, niedrig 48 h</p>

          {status === "done" ? (
            <div role="status" className="mt-6 border border-green-500/40 p-4">
              <p>[ OK ] Ticket {ticket} angelegt.</p>
              <p className="mt-1 text-sm text-green-600">
                Kategorie: {values.category} · Priorität: {PRIORITIES.find((p) => p.value === values.priority).label}
              </p>
              <button type="button" onClick={again} className="mt-3 text-sm underline">
                weiteres Ticket anlegen
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  kundennummer
                  <input
                    className={input}
                    placeholder="KD-12345"
                    value={values.customer}
                    onChange={(e) => setValues((v) => ({ ...v, customer: e.target.value.toUpperCase() }))}
                  />
                </label>
                <label className="block">
                  kategorie
                  <select className={input} value={values.category} onChange={set("category")}>
                    <option>Server</option>
                    <option>Domain</option>
                    <option>E-Mail</option>
                    <option>Rechnung</option>
                  </select>
                </label>
              </div>

              <fieldset>
                <legend>priorität</legend>
                <div className="mt-1 flex gap-2">
                  {PRIORITIES.map((p) => (
                    <label
                      key={p.value}
                      className={`flex-1 cursor-pointer border px-3 py-2 text-center focus-within:ring-1 focus-within:ring-green-400 ${
                        values.priority === p.value
                          ? "border-green-400 bg-green-400 text-black"
                          : "border-green-500/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        className="sr-only"
                        value={p.value}
                        checked={values.priority === p.value}
                        onChange={set("priority")}
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="block">
                beschreibung
                <textarea
                  className={input}
                  rows={5}
                  maxLength={2000}
                  placeholder="Was ist passiert? Seit wann? Welche Fehlermeldung?"
                  value={values.text}
                  onChange={set("text")}
                />
              </label>

              <label className="block">
                sicherheitsfrage: was ergibt {captcha.a} + {captcha.b}?
                <input
                  className={`${input} w-28`}
                  inputMode="numeric"
                  autoComplete="off"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
                />
              </label>

              {error && (
                <p role="alert" className="text-red-400">
                  [ FEHLER ] {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="border border-green-400 px-5 py-2 text-green-400 hover:bg-green-400 hover:text-black disabled:opacity-60"
              >
                {status === "sending" ? "sende …" : "[ ticket absenden ]"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
