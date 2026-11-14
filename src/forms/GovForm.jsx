import { useEffect, useRef, useState } from "react";
import { isEmail, useFakeSubmit } from "../lib/form.js";

const FIELDS = [
  {
    id: "name",
    label: "Vor- und Nachname",
    autoComplete: "name",
    validate: (v) => (v.trim().split(/\s+/).length < 2 ? "Geben Sie Ihren Vor- und Nachnamen ein." : ""),
  },
  {
    id: "street",
    label: "Straße und Hausnummer",
    hint: "Die Adresse, an der Sie gemeldet sind.",
    autoComplete: "street-address",
    validate: (v) => (!/\S+\s+\d/.test(v.trim()) ? "Geben Sie Straße und Hausnummer ein, zum Beispiel Lindenweg 4." : ""),
  },
  {
    id: "plate",
    label: "Kfz-Kennzeichen",
    hint: "Zum Beispiel HH-AB 1234.",
    autoComplete: "off",
    transform: (v) => v.toUpperCase(),
    validate: (v) =>
      !/^[A-ZÄÖÜ]{1,3}-[A-Z]{1,2} \d{1,4}[EH]?$/.test(v.trim())
        ? "Geben Sie das Kennzeichen im Format HH-AB 1234 ein."
        : "",
  },
  {
    id: "email",
    label: "E-Mail-Adresse",
    hint: "An diese Adresse senden wir den Bescheid.",
    type: "email",
    autoComplete: "email",
    validate: (v) => (!isEmail(v) ? "Geben Sie eine E-Mail-Adresse im Format name@beispiel.de ein." : ""),
  },
];

const focusRing = "focus:outline focus:outline-4 focus:outline-offset-0 focus:outline-yellow-400";

export default function GovForm() {
  const [values, setValues] = useState({ name: "", street: "", plate: "", email: "", years: "", confirm: false });
  const [errors, setErrors] = useState([]);
  const summary = useRef(null);
  const { status, submit, reset } = useFakeSubmit(1000);

  // Nach einem fehlgeschlagenen Absenden springt der Fokus zur Fehlerübersicht,
  // damit Screenreader und Tastaturnutzer sofort erfahren, was fehlt.
  useEffect(() => {
    if (errors.length > 0) summary.current?.focus();
  }, [errors]);

  const errorFor = (id) => errors.find((e) => e.id === id)?.message;

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = FIELDS.map((f) => ({ id: f.id, message: f.validate(values[f.id]) })).filter((e) => e.message);
    if (!values.years) next.push({ id: "years-1", message: "Wählen Sie eine Gültigkeitsdauer." });
    if (!values.confirm) next.push({ id: "confirm", message: "Bestätigen Sie, dass Ihre Angaben richtig sind." });
    setErrors(next);
    if (next.length === 0) await submit();
  };

  return (
    <div className="flex flex-1 items-start justify-center bg-white p-6 text-black">
      <div className="w-full max-w-xl">
        <div className="border-b-8 border-blue-800 pb-3">
          <p className="text-lg font-bold">Stadt Musterhausen</p>
          <p className="text-sm">Bürgerservice online</p>
        </div>

        <h2 className="mt-6 text-3xl font-bold">Bewohnerparkausweis beantragen</h2>

        {status === "done" ? (
          <div role="status" className="mt-6 border-l-8 border-green-700 bg-green-50 p-5">
            <p className="text-xl font-bold">Antrag eingegangen</p>
            <p className="mt-2">
              Ihr Aktenzeichen lautet <strong>PA-2027-00417</strong>. Den Bescheid für das Kennzeichen{" "}
              {values.plate} senden wir an {values.email}.
            </p>
            <button type="button" onClick={reset} className={`mt-3 underline ${focusRing}`}>
              Weiteren Antrag stellen
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-7">
            {errors.length > 0 && (
              <div
                ref={summary}
                tabIndex={-1}
                role="alert"
                aria-labelledby="error-title"
                className={`border-4 border-red-700 p-4 ${focusRing}`}
              >
                <h3 id="error-title" className="text-xl font-bold">
                  Es gibt {errors.length === 1 ? "ein Problem" : `${errors.length} Probleme`}
                </h3>
                <ul className="mt-2 space-y-1">
                  {errors.map((error) => (
                    <li key={error.id}>
                      <a
                        href={`#gov-${error.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(`gov-${error.id}`)?.focus();
                        }}
                        className={`font-bold text-red-700 underline ${focusRing}`}
                      >
                        {error.message}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {FIELDS.map((field) => {
              const error = errorFor(field.id);
              return (
                <div key={field.id} className={error ? "border-l-4 border-red-700 pl-4" : ""}>
                  <label htmlFor={`gov-${field.id}`} className="block text-lg font-bold">
                    {field.label}
                  </label>
                  {field.hint && (
                    <p id={`gov-${field.id}-hint`} className="text-neutral-600">
                      {field.hint}
                    </p>
                  )}
                  {error && (
                    <p id={`gov-${field.id}-error`} className="font-bold text-red-700">
                      <span className="sr-only">Fehler: </span>
                      {error}
                    </p>
                  )}
                  <input
                    id={`gov-${field.id}`}
                    type={field.type ?? "text"}
                    autoComplete={field.autoComplete}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                      [field.hint && `gov-${field.id}-hint`, error && `gov-${field.id}-error`].filter(Boolean).join(" ") ||
                      undefined
                    }
                    className={`mt-1 w-full border-2 px-3 py-2 text-lg ${error ? "border-red-700" : "border-black"} ${focusRing}`}
                    value={values[field.id]}
                    onChange={(e) =>
                      setValues({ ...values, [field.id]: field.transform ? field.transform(e.target.value) : e.target.value })
                    }
                  />
                </div>
              );
            })}

            <fieldset
              className={errorFor("years-1") ? "border-l-4 border-red-700 pl-4" : ""}
              aria-describedby={errorFor("years-1") ? "gov-years-error" : undefined}
            >
              <legend className="text-lg font-bold">Gültigkeitsdauer</legend>
              {errorFor("years-1") && (
                <p id="gov-years-error" className="font-bold text-red-700">
                  <span className="sr-only">Fehler: </span>
                  {errorFor("years-1")}
                </p>
              )}
              <div className="mt-2 space-y-2">
                {[
                  { value: "1", label: "1 Jahr (30 Euro)" },
                  { value: "2", label: "2 Jahre (55 Euro)" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 text-lg">
                    <input
                      id={`gov-years-${option.value}`}
                      type="radio"
                      name="years"
                      className={`h-7 w-7 accent-black ${focusRing}`}
                      checked={values.years === option.value}
                      onChange={() => setValues({ ...values, years: option.value })}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={errorFor("confirm") ? "border-l-4 border-red-700 pl-4" : ""}>
              {errorFor("confirm") && (
                <p id="gov-confirm-error" className="font-bold text-red-700">
                  <span className="sr-only">Fehler: </span>
                  {errorFor("confirm")}
                </p>
              )}
              <label className="flex items-start gap-3 text-lg">
                <input
                  id="gov-confirm"
                  type="checkbox"
                  aria-invalid={Boolean(errorFor("confirm"))}
                  aria-describedby={errorFor("confirm") ? "gov-confirm-error" : undefined}
                  className={`mt-0.5 h-7 w-7 shrink-0 accent-black ${focusRing}`}
                  checked={values.confirm}
                  onChange={(e) => setValues({ ...values, confirm: e.target.checked })}
                />
                Ich bestätige, dass meine Angaben vollständig und richtig sind.
              </label>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className={`bg-green-800 px-6 py-3 text-lg font-bold text-white shadow-[0_3px_0_0_#052e16] hover:bg-green-900 disabled:opacity-60 ${focusRing}`}
            >
              {status === "sending" ? "Wird übermittelt …" : "Antrag absenden"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
