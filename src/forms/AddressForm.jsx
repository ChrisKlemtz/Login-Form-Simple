import { useState } from "react";
import { isGermanZip, useFakeSubmit } from "../lib/form.js";

// Kleiner Ausschnitt statt einer echten PLZ-Datenbank.
const CITIES = {
  "01067": "Dresden",
  "04109": "Leipzig",
  10115: "Berlin",
  20095: "Hamburg",
  50667: "Köln",
  60311: "Frankfurt am Main",
  70173: "Stuttgart",
  80331: "München",
};

const EMPTY = { first: "", last: "", street: "", extra: "", zip: "", city: "", country: "Deutschland" };

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20";

function AddressFields({ prefix, value, onChange, errors }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });

  const setZip = (e) => {
    const zip = e.target.value.replace(/\D/g, "").slice(0, 5);
    // Ort nur vorschlagen, wenn das Feld leer ist oder noch der letzte Vorschlag darin steht.
    const suggested = CITIES[zip];
    const untouched = value.city === "" || Object.values(CITIES).includes(value.city);
    onChange({ ...value, zip, city: suggested && untouched ? suggested : value.city });
  };

  const error = (key) =>
    errors[key] && (
      <span role="alert" className="mt-1 block text-sm font-normal text-red-700">
        {errors[key]}
      </span>
    );

  return (
    <div className="grid gap-4 sm:grid-cols-6">
      <label className="block text-sm font-medium sm:col-span-3">
        Vorname
        <input className={input} autoComplete={`${prefix} given-name`} value={value.first} onChange={set("first")} />
        {error("first")}
      </label>
      <label className="block text-sm font-medium sm:col-span-3">
        Nachname
        <input className={input} autoComplete={`${prefix} family-name`} value={value.last} onChange={set("last")} />
        {error("last")}
      </label>
      <label className="block text-sm font-medium sm:col-span-6">
        Straße und Hausnummer
        <input className={input} autoComplete={`${prefix} address-line1`} value={value.street} onChange={set("street")} />
        {error("street")}
      </label>
      <label className="block text-sm font-medium sm:col-span-6">
        Adresszusatz (optional)
        <input
          className={input}
          autoComplete={`${prefix} address-line2`}
          placeholder="Etage, c/o, Firma"
          value={value.extra}
          onChange={set("extra")}
        />
      </label>
      <label className="block text-sm font-medium sm:col-span-2">
        PLZ
        <input
          className={input}
          inputMode="numeric"
          autoComplete={`${prefix} postal-code`}
          value={value.zip}
          onChange={setZip}
        />
        {error("zip")}
      </label>
      <label className="block text-sm font-medium sm:col-span-4">
        Ort
        <input className={input} autoComplete={`${prefix} address-level2`} value={value.city} onChange={set("city")} />
        {error("city")}
      </label>
      <label className="block text-sm font-medium sm:col-span-6">
        Land
        <select className={input} autoComplete={`${prefix} country-name`} value={value.country} onChange={set("country")}>
          <option>Deutschland</option>
          <option>Österreich</option>
          <option>Schweiz</option>
        </select>
      </label>
    </div>
  );
}

const validate = (a) => {
  const errors = {};
  if (a.first.trim().length < 2) errors.first = "Bitte Vornamen angeben.";
  if (a.last.trim().length < 2) errors.last = "Bitte Nachnamen angeben.";
  if (a.street.trim().length < 3) errors.street = "Bitte Straße angeben.";
  else if (!/\d/.test(a.street)) errors.street = "Die Hausnummer fehlt.";
  if (a.country === "Deutschland" ? !isGermanZip(a.zip) : !/^\d{4}$/.test(a.zip))
    errors.zip = a.country === "Deutschland" ? "5 Ziffern." : "4 Ziffern.";
  if (a.city.trim().length < 2) errors.city = "Bitte Ort angeben.";
  return errors;
};

export default function AddressForm() {
  const [shipping, setShipping] = useState(EMPTY);
  const [billing, setBilling] = useState(EMPTY);
  const [separate, setSeparate] = useState(false);
  const [errors, setErrors] = useState({ shipping: {}, billing: {} });
  const { status, submit, reset } = useFakeSubmit();

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = { shipping: validate(shipping), billing: separate ? validate(billing) : {} };
    setErrors(next);
    if (Object.keys(next.shipping).length + Object.keys(next.billing).length === 0) await submit();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-violet-50 p-6 text-slate-900">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold text-violet-700">Paketwerk</p>
        <h2 className="mt-1 text-2xl font-bold">Wohin dürfen wir liefern?</h2>

        {status === "done" ? (
          <div role="status" className="mt-6 rounded-xl bg-violet-50 p-5">
            <p className="font-semibold">Adresse gespeichert.</p>
            <address className="mt-2 text-sm not-italic text-slate-700">
              {shipping.first} {shipping.last}
              <br />
              {shipping.street}
              <br />
              {shipping.zip} {shipping.city}, {shipping.country}
            </address>
            <p className="mt-2 text-sm text-slate-600">
              Rechnung an: {separate ? `${billing.first} ${billing.last}, ${billing.city}` : "dieselbe Adresse"}
            </p>
            <button type="button" onClick={reset} className="mt-3 text-sm text-violet-700 underline">
              Adresse ändern
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-6">
            <fieldset>
              <legend className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Lieferadresse</legend>
              <AddressFields prefix="shipping" value={shipping} onChange={setShipping} errors={errors.shipping} />
            </fieldset>

            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 accent-violet-600"
                checked={separate}
                onChange={(e) => setSeparate(e.target.checked)}
              />
              Abweichende Rechnungsadresse
            </label>

            {separate && (
              <fieldset>
                <legend className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                  Rechnungsadresse
                </legend>
                <AddressFields prefix="billing" value={billing} onChange={setBilling} errors={errors.billing} />
              </fieldset>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {status === "sending" ? "Wird gespeichert …" : "Weiter zur Zahlung"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
