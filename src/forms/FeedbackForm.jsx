import { useState } from "react";
import { isEmail, useFakeSubmit } from "../lib/form.js";

const LABELS = ["", "Gar nicht gut", "Ging so", "Okay", "Gut", "Großartig"];
const TAGS = ["Pünktlich", "Heiß geliefert", "Freundlich", "Gut verpackt", "Zu spät", "Etwas fehlte"];
const MAX = 280;

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(700);

  const shown = hover || rating;

  const toggleTag = (tag) => setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return setError("Bitte vergib mindestens einen Stern.");
    if (email && !isEmail(email)) return setError("Die E-Mail-Adresse sieht nicht richtig aus.");
    setError("");
    await submit();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-yellow-300 p-6 text-slate-900">
      <div className="w-full max-w-md -rotate-1 rounded-[2rem] bg-white p-8 shadow-[0_20px_0_0_rgba(236,72,153,1)]">
        <div className="rotate-1">
          <p className="inline-block rounded-full bg-pink-500 px-3 py-1 text-sm font-bold text-white">Bringbar</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight">Wie war deine Lieferung?</h2>

          {status === "done" ? (
            <div role="status" className="mt-6">
              <p className="text-5xl" aria-hidden="true">
                {"★".repeat(rating)}
              </p>
              <p className="mt-3 text-lg font-bold">Danke für {rating} von 5 Sternen!</p>
              <p className="mt-1 text-sm text-slate-600">Dein Feedback hilft unseren Fahrerinnen und Fahrern.</p>
              <button type="button" onClick={reset} className="mt-3 text-sm font-semibold text-pink-600 underline">
                Bewertung ändern
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
              <fieldset>
                <legend className="sr-only">Bewertung in Sternen</legend>
                <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label
                      key={n}
                      onMouseEnter={() => setHover(n)}
                      className={`cursor-pointer rounded-lg text-5xl leading-none transition focus-within:ring-2 focus-within:ring-pink-500 ${
                        n <= shown ? "scale-110 text-pink-500" : "text-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="rating"
                        className="sr-only"
                        checked={rating === n}
                        onChange={() => setRating(n)}
                      />
                      <span aria-hidden="true">★</span>
                      <span className="sr-only">
                        {n} von 5: {LABELS[n]}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-2 h-5 text-sm font-semibold text-slate-600" aria-hidden="true">
                  {LABELS[shown]}
                </p>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-bold">Was trifft zu?</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={tags.includes(tag)}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border-2 px-3 py-1.5 text-sm font-semibold ${
                        tags.includes(tag)
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 hover:border-slate-900"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block text-sm font-bold">
                Möchtest du noch etwas sagen?
                <textarea
                  rows={3}
                  maxLength={MAX}
                  className="mt-1 w-full rounded-2xl border-2 border-slate-200 p-3 font-normal focus:border-pink-500 focus:outline-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <span
                  className={`block text-right text-xs font-normal tabular-nums ${
                    comment.length > MAX - 20 ? "text-pink-600" : "text-slate-500"
                  }`}
                >
                  noch {MAX - comment.length} Zeichen
                </span>
              </label>

              <label className="block text-sm font-bold">
                E-Mail für Rückfragen (optional)
                <input
                  type="email"
                  autoComplete="email"
                  className="mt-1 w-full rounded-2xl border-2 border-slate-200 p-3 font-normal focus:border-pink-500 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              {error && (
                <p role="alert" className="text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-full bg-pink-500 px-5 py-3 text-lg font-extrabold text-white hover:bg-pink-600 disabled:opacity-60"
              >
                {status === "sending" ? "Wird gesendet …" : "Feedback abschicken"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
