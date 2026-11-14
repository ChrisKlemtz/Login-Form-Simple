import { useState } from "react";
import { isEmail, useFakeSubmit } from "../lib/form.js";

const MAX_BYTES = 5 * 1024 * 1024;
const JOBS = ["Senior Brand Designer (m/w/d)", "Motion Designer (m/w/d)", "Werkstudium Projektmanagement"];

const input =
  "mt-1 w-full border-0 border-b border-black bg-transparent px-0 py-2 text-lg focus:border-b-2 focus:border-[#ff4f00] focus:outline-none focus:ring-0";

const isUrl = (value) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

export default function ApplicationForm() {
  const [values, setValues] = useState({ name: "", email: "", job: JOBS[0], portfolio: "", note: "" });
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const { status, submit, reset } = useFakeSubmit(1300);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const takeFile = (candidate) => {
    if (!candidate) return;
    if (candidate.type !== "application/pdf" && !candidate.name.toLowerCase().endsWith(".pdf")) {
      setFile(null);
      return setErrors((e) => ({ ...e, file: "Bitte nur PDF-Dateien hochladen." }));
    }
    if (candidate.size > MAX_BYTES) {
      setFile(null);
      return setErrors((e) => ({ ...e, file: "Die Datei ist größer als 5 MB." }));
    }
    setErrors((e) => ({ ...e, file: undefined }));
    setFile(candidate);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (values.name.trim().length < 2) next.name = "Bitte gib deinen Namen an.";
    if (!isEmail(values.email)) next.email = "Bitte gib eine gültige E-Mail-Adresse an.";
    if (values.portfolio && !isUrl(values.portfolio)) next.portfolio = "Bitte eine vollständige URL mit https:// angeben.";
    if (!file) next.file = "Bitte lade deinen Lebenslauf als PDF hoch.";
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
    <div className="flex flex-1 items-center justify-center bg-[#f4f1ea] p-6 text-black">
      <div className="w-full max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em]">Studio Kaleido · Karriere</p>
        <h2 className="mt-4 text-5xl font-black uppercase leading-[0.95] tracking-tight">
          Zeig uns,
          <br />
          was du <span className="text-[#ff4f00]">machst.</span>
        </h2>

        {status === "done" ? (
          <div role="status" className="mt-10 border-t-2 border-black pt-6">
            <p className="text-2xl font-black uppercase">Bewerbung eingegangen.</p>
            <p className="mt-2">
              Danke, {values.name}. Wir haben {file?.name} für die Stelle „{values.job}“ erhalten und melden uns
              innerhalb von zwei Wochen.
            </p>
            <button type="button" onClick={reset} className="mt-4 text-sm font-bold uppercase underline">
              Zurück zum Formular
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-10 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-xs font-bold uppercase tracking-widest">
                Name
                <input className={input} autoComplete="name" value={values.name} onChange={set("name")} />
                {error("name")}
              </label>
              <label className="block text-xs font-bold uppercase tracking-widest">
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
            <label className="block text-xs font-bold uppercase tracking-widest">
              Stelle
              <select className={input} value={values.job} onChange={set("job")}>
                {JOBS.map((job) => (
                  <option key={job}>{job}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold uppercase tracking-widest">
              Portfolio-Link (optional)
              <input
                className={input}
                type="url"
                placeholder="https://"
                value={values.portfolio}
                onChange={set("portfolio")}
              />
              {error("portfolio")}
            </label>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest">Lebenslauf</p>
              {file ? (
                <div className="mt-2 flex items-center justify-between border-2 border-black bg-white p-4">
                  <span>
                    <span className="block font-bold">{file.name}</span>
                    <span className="text-sm tabular-nums text-neutral-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </span>
                  <button type="button" onClick={() => setFile(null)} className="text-sm font-bold uppercase underline">
                    Entfernen
                  </button>
                </div>
              ) : (
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    takeFile(e.dataTransfer.files[0]);
                  }}
                  className={`mt-2 block cursor-pointer border-2 border-dashed border-black p-6 text-center focus-within:border-solid focus-within:border-[#ff4f00] ${
                    dragging ? "bg-[#ff4f00] text-white" : "bg-white"
                  }`}
                >
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="sr-only"
                    onChange={(e) => {
                      takeFile(e.target.files[0]);
                      e.target.value = "";
                    }}
                  />
                  <span className="block font-bold">PDF hierher ziehen oder klicken</span>
                  <span className="text-sm">Nur PDF, maximal 5 MB</span>
                </label>
              )}
              {error("file")}
            </div>

            <label className="block text-xs font-bold uppercase tracking-widest">
              Ein Satz über dich (optional)
              <input className={input} maxLength={160} value={values.note} onChange={set("note")} />
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-black px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-[#ff4f00] disabled:opacity-60"
            >
              {status === "sending" ? "Wird hochgeladen …" : "Bewerbung senden →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
