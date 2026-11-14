import { useEffect, useRef, useState } from "react";
import { useFakeSubmit } from "../lib/form.js";

const DEMO_CODE = "246810";
const LENGTH = 6;
const MAX_ATTEMPTS = 3;
const RESEND_SECONDS = 30;

const empty = () => Array(LENGTH).fill("");

export default function OtpForm() {
  const [digits, setDigits] = useState(empty);
  const [attempts, setAttempts] = useState(0);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");
  const refs = useRef([]);
  const { status, submit, reset } = useFakeSubmit(800);

  const locked = attempts >= MAX_ATTEMPTS;
  const code = digits.join("");

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const setAt = (i, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((d) => d.map((old, j) => (j === i ? digit : old)));
    if (digit && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const onPaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!text) return;
    e.preventDefault();
    setDigits(empty().map((_, i) => text[i] ?? ""));
    refs.current[Math.min(text.length, LENGTH - 1)]?.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (locked) return;
    if (code.length < LENGTH) return setError("Bitte alle 6 Ziffern eingeben.");
    if (code !== DEMO_CODE) {
      const used = attempts + 1;
      setAttempts(used);
      setDigits(empty());
      refs.current[0]?.focus();
      return setError(
        used >= MAX_ATTEMPTS
          ? "Zu viele Fehlversuche. Der Zugang ist vorübergehend gesperrt."
          : `Der Code ist falsch. Noch ${MAX_ATTEMPTS - used} Versuch(e).`,
      );
    }
    setError("");
    await submit();
  };

  const resend = () => {
    setSeconds(RESEND_SECONDS);
    setAttempts(0);
    setDigits(empty());
    setError("");
    refs.current[0]?.focus();
  };

  const restart = () => {
    resend();
    reset();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-[#0b1f3a] p-6 text-white">
      <div className="w-full max-w-md rounded-sm border-t-4 border-[#c9a24b] bg-white p-8 text-[#0b1f3a] shadow-2xl">
        <p className="font-serif text-lg font-semibold tracking-wide">Bank Nordkap</p>
        <h2 className="mt-4 text-2xl font-semibold">Anmeldung bestätigen</h2>
        <p className="mt-1 text-sm text-slate-600">
          Wir haben einen 6-stelligen Code an die Nummer mit der Endung •• 47 gesendet.
        </p>

        {status === "done" ? (
          <div role="status" className="mt-6 border-l-4 border-[#c9a24b] bg-slate-50 p-4">
            <p className="font-semibold">Identität bestätigt.</p>
            <p className="mt-1 text-sm text-slate-600">Sie werden zu Ihrem Konto weitergeleitet.</p>
            <button type="button" onClick={restart} className="mt-3 text-sm underline">
              Demo neu starten
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-6">
            <fieldset disabled={locked}>
              <legend className="sr-only">Bestätigungscode</legend>
              <div className="flex justify-between gap-2" onPaste={onPaste}>
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    aria-label={`Ziffer ${i + 1} von ${LENGTH}`}
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => setAt(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                    className="h-14 w-12 rounded-sm border border-slate-300 text-center text-2xl font-semibold tabular-nums focus:border-[#0b1f3a] focus:outline-none focus:ring-2 focus:ring-[#c9a24b] disabled:bg-slate-100"
                  />
                ))}
              </div>
            </fieldset>

            {error && (
              <p role="alert" className="mt-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={locked || status === "sending"}
              className="mt-6 w-full rounded-sm bg-[#0b1f3a] px-5 py-3 font-semibold text-white hover:bg-[#12305a] disabled:opacity-50"
            >
              {status === "sending" ? "Wird geprüft …" : "Bestätigen"}
            </button>

            <p className="mt-4 text-center text-sm text-slate-600">
              {seconds > 0 ? (
                <span className="tabular-nums">Neuen Code anfordern in {seconds} s</span>
              ) : (
                <button type="button" onClick={resend} className="font-semibold text-[#0b1f3a] underline">
                  Neuen Code senden
                </button>
              )}
            </p>
            <p className="mt-4 border-t border-slate-200 pt-3 text-center text-xs text-slate-500">
              Demo-Code: {DEMO_CODE}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
