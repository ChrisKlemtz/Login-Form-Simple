import { useState } from "react";
import { isEmail, useFakeSubmit } from "../lib/form.js";

const QUESTIONS = [
  {
    id: "usage",
    type: "choice",
    text: "Wie oft bist du mit Stadtrad unterwegs?",
    options: ["Täglich", "Mehrmals pro Woche", "Ein paar Mal im Monat", "Selten"],
  },
  { id: "score", type: "scale", text: "Wie wahrscheinlich empfiehlst du Stadtrad weiter?" },
  { id: "improve", type: "text", text: "Was sollten wir als Erstes verbessern?", optional: true },
  { id: "email", type: "email", text: "Dürfen wir dir bei Rückfragen schreiben?", optional: true },
];

const textInput =
  "w-full border-0 border-b-2 border-white/40 bg-transparent px-0 py-3 text-2xl text-white placeholder:text-white/40 focus:border-white focus:outline-none focus:ring-0";

const option =
  "rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-left text-lg hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white";

export default function SurveyForm() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(800);

  const question = QUESTIONS[index];
  const value = answers[question.id] ?? "";
  const last = index === QUESTIONS.length - 1;

  const advance = async (answer) => {
    if (!question.optional && (answer === "" || answer === undefined))
      return setError("Bitte beantworte diese Frage.");
    if (question.type === "email" && answer && !isEmail(answer))
      return setError("Die E-Mail-Adresse sieht nicht richtig aus.");
    setError("");
    setAnswers((a) => ({ ...a, [question.id]: answer }));
    if (last) await submit();
    else setIndex(index + 1);
  };

  const restart = () => {
    setIndex(0);
    setAnswers({});
    reset();
  };

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-br from-violet-700 to-fuchsia-600 text-white">
      <div
        role="progressbar"
        aria-label="Fortschritt der Umfrage"
        aria-valuemin={0}
        aria-valuemax={QUESTIONS.length}
        aria-valuenow={status === "done" ? QUESTIONS.length : index}
        className="h-1.5 bg-white/20"
      >
        <div
          className="h-full bg-white transition-all duration-500"
          style={{ width: `${((status === "done" ? QUESTIONS.length : index) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70">Stadtrad · Umfrage</p>

          {status === "done" ? (
            <div role="status" className="mt-6">
              <p className="text-4xl font-bold">Danke dir!</p>
              <p className="mt-3 text-lg text-white/80">
                Deine Antworten sind angekommen. Du hast Stadtrad mit {answers.score} von 10 bewertet.
              </p>
              <button type="button" onClick={restart} className="mt-5 underline">
                Umfrage neu starten
              </button>
            </div>
          ) : (
            <form
              key={question.id}
              noValidate
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                advance(value);
              }}
            >
              <p className="text-sm tabular-nums text-white/70">
                Frage {index + 1} von {QUESTIONS.length}
                {question.optional && " · optional"}
              </p>
              <h2 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{question.text}</h2>

              <div className="mt-8">
                {question.type === "choice" && (
                  <div className="grid gap-2">
                    {question.options.map((label, i) => (
                      <button
                        key={label}
                        type="button"
                        autoFocus={i === 0}
                        onClick={() => advance(label)}
                        className={`${option} ${value === label ? "bg-white/30" : ""}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {question.type === "scale" && (
                  <div>
                    <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
                      {Array.from({ length: 11 }, (_, n) => (
                        <button
                          key={n}
                          type="button"
                          autoFocus={n === 0}
                          aria-label={`${n} von 10`}
                          onClick={() => advance(n)}
                          className={`${option} px-0 text-center tabular-nums ${value === n ? "bg-white/30" : ""}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-white/70">
                      <span>0 = gar nicht</span>
                      <span>10 = auf jeden Fall</span>
                    </div>
                  </div>
                )}

                {(question.type === "text" || question.type === "email") && (
                  <div>
                    <input
                      autoFocus
                      aria-label={question.text}
                      type={question.type}
                      maxLength={200}
                      autoComplete={question.type === "email" ? "email" : "off"}
                      placeholder={question.type === "email" ? "du@beispiel.de" : "Deine Antwort"}
                      className={textInput}
                      value={value}
                      onChange={(e) => setAnswers((a) => ({ ...a, [question.id]: e.target.value }))}
                    />
                    <div className="mt-6 flex items-center gap-4">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="rounded-xl bg-white px-6 py-3 font-bold text-violet-800 hover:bg-violet-100 disabled:opacity-60"
                      >
                        {status === "sending" ? "Wird gesendet …" : last ? "Absenden" : "Weiter"}
                      </button>
                      <span className="text-sm text-white/70">oder Enter drücken</span>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <p role="alert" className="mt-4 font-semibold text-yellow-200">
                  {error}
                </p>
              )}

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setIndex(index - 1);
                  }}
                  className="mt-8 text-sm text-white/70 underline hover:text-white"
                >
                  ← Vorherige Frage
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
