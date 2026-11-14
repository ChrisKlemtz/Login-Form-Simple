import { useState } from "react";
import { euro, isGermanZip, useFakeSubmit } from "../lib/form.js";

const AMOUNTS = [10, 25, 50, 100];
const TREES_PER_EURO = 0.2;

// IBAN-Prüfung nach ISO 13616: umstellen, Buchstaben in Zahlen wandeln, Rest bei Teilung durch 97 muss 1 sein.
const ibanValid = (raw) => {
  const iban = raw.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false;
  const numeric = (iban.slice(4) + iban.slice(0, 4)).replace(/[A-Z]/g, (c) => c.charCodeAt(0) - 55);
  let rest = 0;
  for (const digit of numeric) rest = (rest * 10 + Number(digit)) % 97;
  return rest === 1;
};

const input =
  "mt-1 w-full rounded-2xl border border-green-900/20 bg-white px-4 py-2.5 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20";

const chip = (active) =>
  `cursor-pointer rounded-2xl border-2 px-3 py-3 text-center font-semibold focus-within:ring-2 focus-within:ring-green-700 ${
    active ? "border-green-800 bg-green-800 text-white" : "border-green-900/15 bg-white hover:border-green-800"
  }`;

export default function DonationForm() {
  const [preset, setPreset] = useState(25);
  const [custom, setCustom] = useState("");
  const [monthly, setMonthly] = useState(false);
  const [name, setName] = useState("");
  const [iban, setIban] = useState("");
  const [receipt, setReceipt] = useState(false);
  const [address, setAddress] = useState({ street: "", zip: "", city: "" });
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(1100);

  const amount = custom !== "" ? Number(custom) : preset;
  const trees = Math.floor(amount * TREES_PER_EURO);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!(amount >= 5 && amount <= 5000)) return setError("Bitte einen Betrag zwischen 5 € und 5.000 € wählen.");
    if (name.trim().length < 3) return setError("Bitte den Namen der Kontoinhaberin oder des Kontoinhabers angeben.");
    if (!ibanValid(iban)) return setError("Die IBAN ist nicht gültig. Bitte prüfe die Eingabe.");
    if (receipt && (address.street.trim().length < 4 || !isGermanZip(address.zip) || address.city.trim().length < 2))
      return setError("Für die Spendenquittung brauchen wir deine vollständige Anschrift.");
    setError("");
    await submit();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-[#eef3e6] p-6 text-green-950">
      <div className="w-full max-w-lg rounded-[2rem] bg-[#fbfaf5] p-8 shadow-sm ring-1 ring-green-900/10">
        <p className="text-sm font-semibold text-green-800">Waldfreunde e. V.</p>
        <h2 className="mt-1 text-3xl font-bold">Pflanz mit uns Wald.</h2>

        {status === "done" ? (
          <div role="status" className="mt-6 rounded-2xl bg-green-800 p-6 text-white">
            <p className="text-lg font-bold">Danke, {name.split(" ")[0]}!</p>
            <p className="mt-1 text-sm">
              Deine {monthly ? "monatliche " : ""}Spende über {euro(amount)} wird per Lastschrift eingezogen.
              {receipt && " Die Spendenquittung kommt im Februar per Post."}
            </p>
            <button type="button" onClick={reset} className="mt-3 text-sm underline">
              Zurück zum Formular
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
            <fieldset>
              <legend className="text-sm font-semibold">Rhythmus</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[false, true].map((value) => (
                  <label key={String(value)} className={chip(monthly === value)}>
                    <input
                      type="radio"
                      name="interval"
                      className="sr-only"
                      checked={monthly === value}
                      onChange={() => setMonthly(value)}
                    />
                    {value ? "Monatlich" : "Einmalig"}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold">Betrag</legend>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {AMOUNTS.map((value) => (
                  <label key={value} className={chip(custom === "" && preset === value)}>
                    <input
                      type="radio"
                      name="amount"
                      className="sr-only"
                      checked={custom === "" && preset === value}
                      onChange={() => {
                        setPreset(value);
                        setCustom("");
                      }}
                    />
                    {value} €
                  </label>
                ))}
              </div>
              <label className="mt-3 block text-sm">
                Oder eigener Betrag in Euro
                <input
                  className={input}
                  inputMode="numeric"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value.replace(/\D/g, "").slice(0, 4))}
                />
              </label>
              <p className="mt-2 text-sm text-green-800" aria-live="polite">
                {trees > 0
                  ? `Damit pflanzen wir ${trees} ${trees === 1 ? "Baum" : "Bäume"}${monthly ? " pro Monat" : ""}.`
                  : "Ab 5 € pflanzen wir einen Baum."}
              </p>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                Kontoinhaber
                <input className={input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="block text-sm font-semibold">
                IBAN
                <input
                  className={`${input} uppercase tabular-nums`}
                  autoComplete="off"
                  placeholder="DE89 3704 0044 …"
                  value={iban}
                  onChange={(e) =>
                    setIban(
                      e.target.value
                        .replace(/[^a-zA-Z0-9]/g, "")
                        .slice(0, 34)
                        .replace(/(.{4})/g, "$1 ")
                        .trim(),
                    )
                  }
                />
              </label>
            </div>

            <label className="flex gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-green-800"
                checked={receipt}
                onChange={(e) => setReceipt(e.target.checked)}
              />
              Ich möchte eine Spendenquittung für das Finanzamt.
            </label>

            {receipt && (
              <div className="grid gap-4 rounded-2xl bg-green-900/5 p-4 sm:grid-cols-[1fr_7rem_1fr]">
                <label className="block text-sm font-semibold">
                  Straße und Nr.
                  <input
                    className={input}
                    autoComplete="street-address"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  />
                </label>
                <label className="block text-sm font-semibold">
                  PLZ
                  <input
                    className={input}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={5}
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value.replace(/\D/g, "") })}
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Ort
                  <input
                    className={input}
                    autoComplete="address-level2"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </label>
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-2xl bg-green-800 px-5 py-3 font-bold text-white hover:bg-green-900 disabled:opacity-60"
            >
              {status === "sending" ? "Wird gesendet …" : `${euro(amount || 0)} ${monthly ? "monatlich " : ""}spenden`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
