import { useEffect, useState } from "react";
import { forms } from "../forms/registry.js";

const numbered = forms.map((form, i) => ({ ...form, number: String(i + 1).padStart(2, "0") }));

export default function Gallery() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "COLLECTION Forms";
  }, []);

  const needle = query.trim().toLowerCase();
  const visible = numbered.filter(
    (form) =>
      !needle ||
      [form.title, form.type, form.useCase, form.brand, ...form.tags].join(" ").toLowerCase().includes(needle),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Collection 01</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">Forms</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          {forms.length} Formulare für unterschiedliche Anwendungsfälle, jedes mit eigenem Design, eigener
          Validierung und eigenem Schutz gegen Spam und Missbrauch. Alles läuft im Browser, ohne Backend.
        </p>
        <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-wrap items-center gap-4">
          <input
            type="search"
            aria-label="Formulare durchsuchen"
            placeholder="Suchen, z. B. Login, Captcha, Buchung"
            maxLength={40}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-sm rounded-xl border border-slate-300 bg-white px-4 py-2.5 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          />
          <p role="status" className="text-sm tabular-nums text-slate-500">
            {visible.length} von {forms.length} Formularen
          </p>
        </form>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {visible.length === 0 && (
          <p className="rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center text-slate-600">
            Kein Formular passt zu „{query}“.
          </p>
        )}
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((form) => (
            <li key={form.slug}>
              <a
                href={`#/${form.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                <div className={`flex h-28 items-end justify-between p-4 ${form.swatch}`}>
                  <span className="text-4xl font-bold tabular-nums opacity-90">{form.number}</span>
                  <span className="text-sm font-medium opacity-90">{form.brand}</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="text-lg font-semibold group-hover:underline">{form.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{form.type}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {form.tags.map((tag) => (
                      <li key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-slate-500">
          Alle Marken und Firmen in dieser Sammlung sind frei erfunden. Es werden keine Daten übertragen oder
          gespeichert.
        </p>
      </main>
    </div>
  );
}
