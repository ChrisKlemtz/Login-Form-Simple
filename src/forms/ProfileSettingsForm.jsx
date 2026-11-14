import { useEffect, useState } from "react";
import { useFakeSubmit } from "../lib/form.js";

const DRAFT_KEY = "collection-forms:profile-draft";
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const BIO_MAX = 160;

const INITIAL = {
  name: "Mara Lindqvist",
  role: "Produktdesignerin",
  bio: "Gestaltet Dinge, die man gern benutzt.",
  mailDigest: true,
  mailMentions: true,
};

const readDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? { ...INITIAL, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
};

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

export default function ProfileSettingsForm() {
  const [saved, setSaved] = useState(INITIAL);
  const [restored] = useState(readDraft);
  const [draft, setDraft] = useState(restored ?? INITIAL);
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(800);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  // Entwurf automatisch sichern, damit ein versehentliches Schließen nichts kostet.
  useEffect(() => {
    try {
      if (dirty) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      else localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ohne Speicher gibt es keinen Entwurf, das Formular funktioniert trotzdem
    }
  }, [draft, dirty]);

  // Der Browser fragt nach, bevor ungespeicherte Änderungen verloren gehen.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => () => avatar && URL.revokeObjectURL(avatar), [avatar]);

  const set = (key, value) => {
    if (status === "done") reset();
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const onAvatar = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
      return setError("Bitte ein Bild als PNG, JPG oder WebP wählen.");
    if (file.size > MAX_AVATAR_BYTES) return setError("Das Bild ist größer als 2 MB.");
    setError("");
    setAvatar(URL.createObjectURL(file));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (draft.name.trim().length < 2) return setError("Der Name darf nicht leer sein.");
    setError("");
    await submit();
    setSaved(draft);
  };

  const initials = draft.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-100 p-6 text-slate-900">
      <form onSubmit={onSubmit} noValidate className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Pilot · Einstellungen</p>
          <h2 className="text-xl font-bold">Profil</h2>
        </div>

        <div className="space-y-5 px-6 py-5">
          {restored && dirty && (
            <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
              Dein ungespeicherter Entwurf vom letzten Besuch wurde wiederhergestellt.
            </p>
          )}

          <div className="flex items-center gap-4">
            {avatar ? (
              <img src={avatar} alt="Vorschau des Profilbilds" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white"
              >
                {initials || "?"}
              </span>
            )}
            <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50 focus-within:ring-2 focus-within:ring-blue-600">
              <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onAvatar} />
              Bild ändern
            </label>
            <span className="text-xs text-slate-500">PNG, JPG oder WebP, max. 2 MB</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Anzeigename
              <input className={input} maxLength={50} value={draft.name} onChange={(e) => set("name", e.target.value)} />
            </label>
            <label className="block text-sm font-medium">
              Rolle
              <input className={input} maxLength={50} value={draft.role} onChange={(e) => set("role", e.target.value)} />
            </label>
          </div>

          <label className="block text-sm font-medium">
            Kurzbeschreibung
            <textarea
              className={input}
              rows={2}
              maxLength={BIO_MAX}
              value={draft.bio}
              onChange={(e) => set("bio", e.target.value)}
            />
            <span className="block text-right text-xs font-normal tabular-nums text-slate-500">
              {draft.bio.length} / {BIO_MAX}
            </span>
          </label>

          <fieldset>
            <legend className="text-sm font-medium">E-Mail-Benachrichtigungen</legend>
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-600"
                  checked={draft.mailDigest}
                  onChange={(e) => set("mailDigest", e.target.checked)}
                />
                Wöchentliche Zusammenfassung
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-600"
                  checked={draft.mailMentions}
                  onChange={(e) => set("mailMentions", e.target.checked)}
                />
                Wenn mich jemand erwähnt
              </label>
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3">
          <p role="status" className="text-sm text-slate-600">
            {status === "done" && !dirty
              ? "Alle Änderungen gespeichert."
              : dirty
                ? "Ungespeicherte Änderungen"
                : "Keine Änderungen"}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!dirty}
              onClick={() => setDraft(saved)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40"
            >
              Verwerfen
            </button>
            <button
              type="submit"
              disabled={!dirty || status === "sending"}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
            >
              {status === "sending" ? "Speichert …" : "Speichern"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
