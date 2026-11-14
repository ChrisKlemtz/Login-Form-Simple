import { useState } from "react";
import { useFakeSubmit } from "../lib/form.js";

const MAX = 500;
const BLOCKED = ["viagra", "casino", "krypto-gewinn"];

const INITIAL = [
  { id: 1, name: "Jonas", text: "Schöner Text. Der Teil über **Sauerteig** hat mir gefehlt." },
  { id: 2, name: "Elif", text: "Ich backe seit Jahren so, *nie wieder* anders." },
];

/**
 * Wandelt **fett** und *kursiv* in React-Elemente um.
 * Es wird nie HTML eingefügt: Spitze Klammern erscheinen als normaler Text.
 */
function Rich({ text }) {
  return text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export default function CommentForm() {
  const [comments, setComments] = useState(INITIAL);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(600);

  const onSubmit = async (e) => {
    e.preventDefault();
    const clean = text.trim();
    if (name.trim().length < 2) return setError("Bitte gib einen Namen an.");
    if (clean.length < 5) return setError("Der Kommentar ist zu kurz.");
    if ((clean.match(/https?:\/\/|www\./gi) ?? []).length > 1) return setError("Bitte höchstens einen Link.");
    if (BLOCKED.some((word) => clean.toLowerCase().includes(word)))
      return setError("Der Kommentar enthält gesperrte Begriffe.");
    if (comments.some((c) => c.text.trim() === clean)) return setError("Dieser Kommentar wurde schon abgeschickt.");
    setError("");
    await submit();
    setComments((list) => [...list, { id: Date.now(), name: name.trim(), text: clean }]);
    setText("");
    reset();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-[#fdfcf8] p-6 font-serif text-stone-900">
      <div className="w-full max-w-xl">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-rose-800">Tintenfass Magazin</p>
        <h2 className="mt-2 text-3xl font-bold">Kommentare ({comments.length})</h2>

        <ul className="mt-6 space-y-5 border-l-2 border-stone-200 pl-5">
          {comments.map((c) => (
            <li key={c.id}>
              <p className="font-sans text-sm font-bold">{c.name}</p>
              <p className="mt-1 whitespace-pre-wrap break-words text-lg leading-relaxed">
                <Rich text={c.text} />
              </p>
            </li>
          ))}
        </ul>

        <form onSubmit={onSubmit} noValidate className="mt-8 border-t border-stone-300 pt-6 font-sans">
          <label className="block text-sm font-semibold">
            Name
            <input
              className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/20"
              maxLength={40}
              autoComplete="nickname"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Dein Kommentar
            <textarea
              rows={4}
              maxLength={MAX}
              aria-describedby="comment-hint"
              className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/20"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <p id="comment-hint" className="mt-1 flex justify-between text-xs text-stone-500">
            <span>**fett** und *kursiv* sind möglich. HTML wird nicht ausgeführt.</span>
            <span className="tabular-nums">
              {text.length} / {MAX}
            </span>
          </p>

          {text.trim() && (
            <div className="mt-4 rounded bg-stone-100 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Vorschau</p>
              <p className="mt-1 whitespace-pre-wrap break-words font-serif text-lg leading-relaxed">
                <Rich text={text} />
              </p>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-4 rounded bg-rose-800 px-5 py-2.5 font-semibold text-white hover:bg-rose-900 disabled:opacity-60"
          >
            {status === "sending" ? "Wird veröffentlicht …" : "Kommentar veröffentlichen"}
          </button>
        </form>
      </div>
    </div>
  );
}
