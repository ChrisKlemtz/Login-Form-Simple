import { useState } from "react";
import { isEmail, isGermanZip, useFakeSubmit } from "../lib/form.js";

const STEPS = ["Gebäude", "Verbrauch", "Kontakt", "Prüfen"];
const HOUSES = ["Einfamilienhaus", "Doppelhaus", "Mehrfamilienhaus", "Gewerbe"];

const input =
  "mt-1 w-full rounded-xl border border-emerald-900/20 bg-white px-3 py-2.5 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20";

export default function QuoteWizardForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    house: "",
    roof: "",
    usage: 4000,
    battery: false,
    name: "",
    email: "",
    zip: "",
  });
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(1200);

  const set = (key, value) => setData((d) => ({ ...d, [key]: value }));

  const validate = () => {
    if (step === 0) {
      if (!data.house) return "Bitte wählen Sie einen Gebäudetyp.";
      if (!(Number(data.roof) >= 10 && Number(data.roof) <= 2000))
        return "Bitte geben Sie eine Dachfläche zwischen 10 und 2000 m² an.";
    }
    if (step === 2) {
      if (data.name.trim().length < 2) return "Bitte geben Sie Ihren Namen an.";
      if (!isEmail(data.email)) return "Bitte geben Sie eine gültige E-Mail-Adresse an.";
      if (!isGermanZip(data.zip)) return "Bitte geben Sie eine fünfstellige Postleitzahl an.";
    }
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const message = validate();
    setError(message);
    if (message) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else await submit();
  };

  const restart = () => {
    setStep(0);
    reset();
  };

  // Grobe Schätzung, nur zur Veranschaulichung.
  const kwp = Math.min(Math.round((Number(data.roof) || 0) / 6), Math.ceil(data.usage / 900));

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-yellow-100 to-emerald-100 p-6 text-emerald-950">
      <div className="w-full max-w-xl rounded-3xl bg-white/80 p-8 shadow-xl">
        <p className="text-sm font-bold text-emerald-700">☀ Sonnenwerk Solar</p>
        <h2 className="mt-1 text-2xl font-bold">Ihr Solar-Angebot in 4 Schritten</h2>

        <ol className="mt-6 flex gap-2" aria-label="Fortschritt">
          {STEPS.map((label, i) => (
            <li key={label} className="flex-1" aria-current={i === step ? "step" : undefined}>
              <div className={`h-2 rounded-full ${i <= step ? "bg-emerald-600" : "bg-emerald-900/10"}`} />
              <span className={`mt-1 block text-xs ${i === step ? "font-bold" : "text-emerald-900/60"}`}>
                {i + 1}. {label}
              </span>
            </li>
          ))}
        </ol>

        {status === "done" ? (
          <div role="status" className="mt-8 rounded-2xl bg-emerald-600 p-6 text-white">
            <p className="text-lg font-bold">Anfrage gesendet.</p>
            <p className="mt-1 text-sm">
              Ihr unverbindliches Angebot für ca. {kwp} kWp kommt in den nächsten Tagen an {data.email}.
            </p>
            <button type="button" onClick={restart} className="mt-3 text-sm underline">
              Neue Anfrage starten
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-8">
            {step === 0 && (
              <div className="space-y-5">
                <fieldset>
                  <legend className="text-sm font-semibold">Gebäudetyp</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {HOUSES.map((house) => (
                      <label
                        key={house}
                        className={`cursor-pointer rounded-xl border-2 p-3 text-sm font-medium focus-within:ring-2 focus-within:ring-emerald-700 ${
                          data.house === house ? "border-emerald-600 bg-emerald-50" : "border-emerald-900/10 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="house"
                          className="sr-only"
                          checked={data.house === house}
                          onChange={() => set("house", house)}
                        />
                        {house}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="block text-sm font-semibold">
                  Nutzbare Dachfläche in m²
                  <input
                    className={input}
                    type="number"
                    inputMode="numeric"
                    min="10"
                    max="2000"
                    value={data.roof}
                    onChange={(e) => set("roof", e.target.value)}
                  />
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <label className="block text-sm font-semibold">
                  Stromverbrauch pro Jahr: {data.usage.toLocaleString("de-DE")} kWh
                  <input
                    type="range"
                    min="1000"
                    max="15000"
                    step="250"
                    className="mt-3 w-full accent-emerald-600"
                    value={data.usage}
                    onChange={(e) => set("usage", Number(e.target.value))}
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border-2 border-emerald-900/10 bg-white p-3 text-sm font-semibold">
                  Mit Batteriespeicher planen
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-emerald-600"
                    checked={data.battery}
                    onChange={(e) => set("battery", e.target.checked)}
                  />
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold">
                  Name
                  <input
                    className={input}
                    autoComplete="name"
                    value={data.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </label>
                <label className="block text-sm font-semibold">
                  E-Mail
                  <input
                    className={input}
                    type="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Postleitzahl
                  <input
                    className={input}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={5}
                    value={data.zip}
                    onChange={(e) => set("zip", e.target.value.replace(/\D/g, ""))}
                  />
                </label>
              </div>
            )}

            {step === 3 && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-2xl bg-emerald-50 p-5 text-sm">
                <dt className="text-emerald-900/60">Gebäude</dt>
                <dd className="font-semibold">{data.house}</dd>
                <dt className="text-emerald-900/60">Dachfläche</dt>
                <dd className="font-semibold">{data.roof} m²</dd>
                <dt className="text-emerald-900/60">Verbrauch</dt>
                <dd className="font-semibold">{data.usage.toLocaleString("de-DE")} kWh pro Jahr</dd>
                <dt className="text-emerald-900/60">Speicher</dt>
                <dd className="font-semibold">{data.battery ? "Ja" : "Nein"}</dd>
                <dt className="text-emerald-900/60">Kontakt</dt>
                <dd className="font-semibold">
                  {data.name}, {data.email}, {data.zip}
                </dd>
                <dt className="text-emerald-900/60">Schätzung</dt>
                <dd className="font-semibold">ca. {kwp} kWp Anlagenleistung</dd>
              </dl>
            )}

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(step - 1);
                }}
                disabled={step === 0}
                className="rounded-full px-5 py-2.5 font-semibold text-emerald-800 hover:bg-emerald-100 disabled:invisible"
              >
                Zurück
              </button>
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-full bg-emerald-600 px-6 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {status === "sending"
                  ? "Wird gesendet …"
                  : step === STEPS.length - 1
                    ? "Angebot anfordern"
                    : "Weiter"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
