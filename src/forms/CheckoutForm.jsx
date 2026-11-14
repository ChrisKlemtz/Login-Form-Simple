import { useState } from "react";
import { euro, useFakeSubmit } from "../lib/form.js";

// Luhn-Prüfsumme: erkennt Tippfehler in Kartennummern.
const luhn = (number) => {
  let sum = 0;
  let double = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = Number(number[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return number.length >= 13 && sum % 10 === 0;
};

const cardType = (number) => {
  if (/^4/.test(number)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(number)) return "Mastercard";
  if (/^3[47]/.test(number)) return "Amex";
  return "Karte";
};

const expiryValid = (expiry) => {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  if (month < 1 || month > 12) return false;
  // Gültig bis zum letzten Tag des Monats.
  return new Date(2000 + Number(match[2]), month, 1) > new Date();
};

const input =
  "mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 tabular-nums focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20";

export default function CheckoutForm() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState({});
  const { status, submit, reset } = useFakeSubmit(1400);

  const digits = number.replace(/\s/g, "");
  const total = 164.9;

  const onNumber = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    setNumber(raw.replace(/(.{4})/g, "$1 ").trim());
  };

  const onExpiry = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setExpiry(raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (name.trim().length < 3) next.name = "Bitte den Namen wie auf der Karte angeben.";
    if (!luhn(digits)) next.number = "Die Kartennummer ist ungültig.";
    if (!expiryValid(expiry)) next.expiry = "Ungültig oder abgelaufen.";
    if (!/^\d{3,4}$/.test(cvc)) next.cvc = "3 oder 4 Ziffern.";
    setErrors(next);
    if (Object.keys(next).length === 0) await submit();
  };

  const error = (key) =>
    errors[key] && (
      <span role="alert" className="mt-1 block text-sm font-normal text-red-700">
        {errors[key]}
      </span>
    );

  return (
    <div className="flex flex-1 items-center justify-center bg-stone-100 p-6 text-stone-900">
      <div className="w-full max-w-md">
        <div className="flex items-baseline justify-between">
          <p className="font-bold tracking-wide text-teal-800">FJORD OUTDOOR</p>
          <p className="text-sm text-stone-600">Schritt 3 von 3: Zahlung</p>
        </div>

        <div
          aria-hidden="true"
          className="mt-5 flex aspect-[1.6] flex-col justify-between rounded-2xl bg-gradient-to-br from-teal-800 to-slate-900 p-6 text-white shadow-xl"
        >
          <div className="flex justify-between text-sm">
            <span className="h-8 w-11 rounded-md bg-amber-300/90" />
            <span className="font-semibold">{cardType(digits)}</span>
          </div>
          <p className="font-mono text-xl tracking-widest">{number || "•••• •••• •••• ••••"}</p>
          <div className="flex justify-between text-sm uppercase">
            <span>{name || "Name auf der Karte"}</span>
            <span>{expiry || "MM/JJ"}</span>
          </div>
        </div>

        {status === "done" ? (
          <div role="status" className="mt-6 rounded-xl bg-white p-6 shadow-sm">
            <p className="text-lg font-bold text-teal-800">Zahlung erfolgreich (simuliert).</p>
            <p className="mt-1 text-sm text-stone-600">
              {euro(total)} mit {cardType(digits)} •••• {digits.slice(-4)}. Es wurde nichts übertragen.
            </p>
            <button type="button" onClick={reset} className="mt-3 text-sm underline">
              Zurück zum Formular
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
            <p className="rounded-lg bg-amber-100 p-3 text-sm text-amber-950">
              Demo-Formular: bitte keine echten Kartendaten eingeben.
            </p>
            <label className="block text-sm font-medium">
              Name auf der Karte
              <input
                className={input}
                autoComplete="cc-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {error("name")}
            </label>
            <label className="block text-sm font-medium">
              Kartennummer
              <input
                className={input}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                value={number}
                onChange={onNumber}
              />
              {error("number")}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm font-medium">
                Gültig bis
                <input
                  className={input}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/JJ"
                  value={expiry}
                  onChange={onExpiry}
                />
                {error("expiry")}
              </label>
              <label className="block text-sm font-medium">
                Prüfziffer
                <input
                  className={input}
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={4}
                  placeholder="CVC"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                />
                {error("cvc")}
              </label>
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-teal-800 px-5 py-3 font-semibold text-white hover:bg-teal-900 disabled:opacity-60"
            >
              {status === "sending" ? "Zahlung wird geprüft …" : `${euro(total)} bezahlen`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
