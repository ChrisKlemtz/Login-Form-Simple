import { useEffect } from "react";
import { forms } from "../forms/registry.js";

function Section({ title, children }) {
  return (
    <section className="mt-7">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

function List({ items }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const navLink =
  "rounded-lg px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900";

export default function FormPage({ index }) {
  const form = forms[index];
  const Form = form.component;
  const prev = forms[index - 1];
  const next = forms[index + 1];

  useEffect(() => {
    document.title = `${form.title} · COLLECTION Forms`;
  }, [form]);

  return (
    <div className="min-h-screen bg-white text-slate-900 lg:grid lg:grid-cols-[minmax(0,1fr)_400px]">
      <main className="flex min-h-[640px] flex-col lg:min-h-screen">
        <Form />
      </main>

      <aside className="flex flex-col border-t border-slate-200 bg-slate-50 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-l lg:border-t-0">
        <nav className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <a href="#/" className={navLink}>
            ← Übersicht
          </a>
          <span className="text-sm tabular-nums text-slate-500">
            {String(index + 1).padStart(2, "0")} / {forms.length}
          </span>
        </nav>

        <div className="flex-1 px-6 py-6">
          <p className="text-sm text-slate-500">{form.brand}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{form.title}</h1>

          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-slate-500">Art</dt>
            <dd className="font-medium">{form.type}</dd>
            <dt className="text-slate-500">Einsatz</dt>
            <dd className="font-medium">{form.useCase}</dd>
            <dt className="text-slate-500">Design</dt>
            <dd className="font-medium">{form.design}</dd>
          </dl>

          <Section title="Beschreibung">
            <p>{form.description}</p>
          </Section>

          <Section title="Was es kann">
            <List items={form.features} />
          </Section>

          <Section title="Sicherheit und Spam-Schutz">
            <List items={form.security} />
          </Section>

          {form.tryIt && (
            <Section title="Ausprobieren">
              <p className="rounded-lg border border-slate-200 bg-white p-3">{form.tryIt}</p>
            </Section>
          )}

          <Section title="Für den echten Einsatz">
            <p>{form.production}</p>
          </Section>
        </div>

        <nav className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          {prev ? (
            <a href={`#/${prev.slug}`} className={navLink}>
              ← {prev.title}
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a href={`#/${next.slug}`} className={`${navLink} text-right`}>
              {next.title} →
            </a>
          ) : (
            <span />
          )}
        </nav>
      </aside>
    </div>
  );
}
