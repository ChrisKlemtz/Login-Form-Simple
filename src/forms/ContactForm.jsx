import { useRef, useState } from "react";
import Honeypot from "../components/Honeypot.jsx";
import { isEmail, useFakeSubmit } from "../lib/form.js";

const MIN_SECONDS = 4;
const MAX_LENGTH = 1000;
const MAX_LINKS = 2;

const input =
  "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-700/20";

export default function ContactForm() {
  const openedAt = useRef(Date.now());
  const [values, setValues] = useState({ name: "", email: "", topic: "", message: "", privacy: false });
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState({});
  const { status, submit, reset } = useFakeSubmit();

  const set = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (values.name.trim().length < 2) next.name = "Bitte geben Sie Ihren Namen an.";
    if (!isEmail(values.email)) next.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
    if (!values.topic) next.topic = "Bitte wählen Sie ein Thema.";
    if (values.message.trim().length < 20) next.message = "Bitte schreiben Sie mindestens 20 Zeichen.";
    if ((values.message.match(/https?:\/\//gi) ?? []).length > MAX_LINKS)
      next.message = `Bitte höchstens ${MAX_LINKS} Links in der Nachricht.`;
    if (!values.privacy) next.privacy = "Bitte stimmen Sie der Verarbeitung zu.";

    const seconds = (Date.now() - openedAt.current) / 1000;
    if (seconds < MIN_SECONDS)
      next.form = `Das ging sehr schnell (${seconds.toFixed(1)} s). Bitte versuchen Sie es in einem Moment erneut.`;
    if (trap) next.form = "Die Nachricht konnte nicht gesendet werden.";

    setErrors(next);
    if (Object.keys(next).length === 0) await submit();
  };

  const error = (key) =>
    errors[key] && (
      <span role="alert" className="mt-1 block text-sm text-red-700">
        {errors[key]}
      </span>
    );

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-sky-800">Nordlicht Steuerberatung</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Kontakt aufnehmen</h2>
        <p className="mt-1 text-sm text-slate-600">Wir melden uns innerhalb eines Werktags bei Ihnen.</p>

        {status === "done" ? (
          <div role="status" className="mt-6 rounded-md bg-sky-50 p-5 text-slate-800">
            <p className="font-semibold">Vielen Dank, {values.name}.</p>
            <p className="mt-1 text-sm">Ihre Nachricht ist eingegangen. Eine Kopie geht an {values.email}.</p>
            <button type="button" onClick={reset} className="mt-3 text-sm text-sky-800 underline">
              Weitere Nachricht schreiben
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="relative mt-6 space-y-4">
            <Honeypot value={trap} onChange={setTrap} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Name
                <input className={input} autoComplete="name" value={values.name} onChange={set("name")} />
                {error("name")}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                E-Mail
                <input
                  className={input}
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={set("email")}
                />
                {error("email")}
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              Thema
              <select className={input} value={values.topic} onChange={set("topic")}>
                <option value="">Bitte wählen</option>
                <option>Erstberatung</option>
                <option>Jahresabschluss</option>
                <option>Lohnbuchhaltung</option>
                <option>Sonstiges</option>
              </select>
              {error("topic")}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Nachricht
              <textarea
                className={input}
                rows={5}
                maxLength={MAX_LENGTH}
                value={values.message}
                onChange={set("message")}
              />
              <span className="mt-1 block text-right text-xs font-normal tabular-nums text-slate-500">
                {values.message.length} / {MAX_LENGTH}
              </span>
              {error("message")}
            </label>
            <label className="flex gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-sky-700"
                checked={values.privacy}
                onChange={set("privacy")}
              />
              <span>
                Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden.
                {error("privacy")}
              </span>
            </label>
            {errors.form && (
              <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {errors.form}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-md bg-sky-800 px-5 py-2.5 font-medium text-white hover:bg-sky-900 disabled:opacity-60"
            >
              {status === "sending" ? "Wird gesendet …" : "Nachricht senden"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
