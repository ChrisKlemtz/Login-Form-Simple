import { useState } from "react";
import { euro, isEmail, useFakeSubmit } from "../lib/form.js";

const AMOUNT = { min: 1000, max: 50000, step: 500 };
const MONTHS = { min: 12, max: 96, step: 6 };
const PURPOSES = [
  { id: "free", label: "Freie Verwendung", rate: 6.9 },
  { id: "car", label: "Fahrzeug", rate: 5.4 },
  { id: "home", label: "Modernisierung", rate: 4.8 },
];

const clamp = (value, { min, max }) => Math.min(max, Math.max(min, value));

// Annuitätenformel: gleichbleibende Monatsrate aus Betrag, Monatszins und Laufzeit.
const monthlyRate = (amount, yearlyPercent, months) => {
  const r = yearlyPercent / 100 / 12;
  return (amount * r) / (1 - (1 + r) ** -months);
};

export default function LoanCalculatorForm() {
  const [amount, setAmount] = useState(12000);
  const [amountText, setAmountText] = useState("12000");
  const [months, setMonths] = useState(48);
  const [purpose, setPurpose] = useState("free");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(1000);

  const rate = PURPOSES.find((p) => p.id === purpose).rate;
  const monthly = monthlyRate(amount, rate, months);
  const total = monthly * months;
  const interest = total - amount;

  const commitAmount = () => {
    // Freie Eingabe wird erst beim Verlassen des Felds auf den erlaubten Bereich gebracht.
    const next = clamp(Math.round((Number(amountText) || 0) / AMOUNT.step) * AMOUNT.step, AMOUNT);
    setAmount(next);
    setAmountText(String(next));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) return setError("Bitte eine gültige E-Mail-Adresse angeben.");
    setError("");
    await submit();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-sky-50 p-6 text-slate-900">
      <div className="grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <form onSubmit={onSubmit} noValidate className="space-y-6 p-8">
          <div>
            <p className="text-sm font-bold text-sky-700">Zinsklar</p>
            <h2 className="mt-1 text-2xl font-bold">Kreditrechner</h2>
          </div>

          <div>
            <label className="flex items-end justify-between text-sm font-semibold">
              Wunschbetrag in Euro
              <input
                inputMode="numeric"
                className="w-28 rounded-lg border border-slate-300 px-2 py-1 text-right text-lg tabular-nums focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
                value={amountText}
                onChange={(e) => setAmountText(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onBlur={commitAmount}
              />
            </label>
            <input
              type="range"
              aria-label="Wunschbetrag"
              {...AMOUNT}
              className="mt-3 w-full accent-sky-600"
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
                setAmountText(e.target.value);
              }}
            />
            <div className="flex justify-between text-xs tabular-nums text-slate-500">
              <span>{euro(AMOUNT.min)}</span>
              <span>{euro(AMOUNT.max)}</span>
            </div>
          </div>

          <label className="block text-sm font-semibold">
            Laufzeit: {months} Monate
            <input
              type="range"
              {...MONTHS}
              className="mt-3 w-full accent-sky-600"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
            />
          </label>

          <fieldset>
            <legend className="text-sm font-semibold">Verwendung</legend>
            <div className="mt-2 space-y-2">
              {PURPOSES.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-sky-600 ${
                    purpose === p.id ? "border-sky-600 bg-sky-50" : "border-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="purpose"
                      className="accent-sky-600"
                      checked={purpose === p.id}
                      onChange={() => setPurpose(p.id)}
                    />
                    {p.label}
                  </span>
                  <span className="tabular-nums text-slate-600">{p.rate.toLocaleString("de-DE")} % p. a.</span>
                </label>
              ))}
            </div>
          </fieldset>

          {status === "done" ? (
            <div role="status" className="rounded-xl bg-sky-50 p-4 text-sm">
              <p className="font-semibold">Angebot ist unterwegs.</p>
              <p className="mt-1 text-slate-600">Wir schicken die Berechnung an {email}.</p>
              <button type="button" onClick={reset} className="mt-2 underline">
                Neu rechnen
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold">
                Berechnung per E-Mail erhalten
                <input
                  type="email"
                  autoComplete="email"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              {error && (
                <p role="alert" className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-3 w-full rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
              >
                {status === "sending" ? "Wird gesendet …" : "Unverbindlich anfragen"}
              </button>
            </div>
          )}
        </form>

        <div className="flex flex-col justify-center bg-sky-700 p-8 text-white" aria-live="polite">
          <p className="text-sm uppercase tracking-widest text-sky-200">Monatliche Rate</p>
          <p className="mt-1 text-5xl font-bold tabular-nums">{euro(monthly)}</p>

          <div className="mt-8 flex h-3 overflow-hidden rounded-full bg-sky-900" aria-hidden="true">
            <div className="bg-white" style={{ width: `${(amount / total) * 100}%` }} />
            <div className="bg-amber-300" style={{ width: `${(interest / total) * 100}%` }} />
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="flex items-center gap-2">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-white" />
                Kreditbetrag
              </dt>
              <dd className="tabular-nums">{euro(amount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-2">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                Zinsen gesamt
              </dt>
              <dd className="tabular-nums">{euro(interest)}</dd>
            </div>
            <div className="flex justify-between border-t border-sky-500 pt-2 font-semibold">
              <dt>Gesamtbetrag</dt>
              <dd className="tabular-nums">{euro(total)}</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-sky-200">
            Beispielrechnung mit festem Sollzins. Kein verbindliches Angebot, die Zinssätze sind erfunden.
          </p>
        </div>
      </div>
    </div>
  );
}
