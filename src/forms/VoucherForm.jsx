import { useState } from "react";
import { euro, useFakeSubmit } from "../lib/form.js";

// Ohne 0, O, 1 und I: Diese Zeichen werden beim Abtippen ständig verwechselt.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LENGTH = 12;
const MAX_ATTEMPTS = 5;

// Das letzte Zeichen ist eine Prüfziffer über die elf Zeichen davor.
const checkChar = (body) =>
  ALPHABET[[...body].reduce((sum, char, i) => sum + ALPHABET.indexOf(char) * (i + 1), 0) % ALPHABET.length];

const format = (code) => code.replace(/(.{4})(?=.)/g, "$1-");

const DEMO_BODY = "LESEFREUDE7";
const DEMO_CODE = DEMO_BODY + checkChar(DEMO_BODY);
const VALUE = 25;

export default function VoucherForm() {
  const [code, setCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [redeemed, setRedeemed] = useState([]);
  const [error, setError] = useState("");
  const { status, submit, reset } = useFakeSubmit(900);

  const locked = attempts >= MAX_ATTEMPTS;

  const onChange = (e) => {
    // Kleinbuchstaben werden groß, Bindestriche, Leerzeichen und ungültige Zeichen fallen weg.
    const clean = e.target.value.toUpperCase();
    setCode([...clean].filter((char) => ALPHABET.includes(char)).join("").slice(0, LENGTH));
  };

  const fail = (message) => {
    setAttempts((a) => a + 1);
    setError(message);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (locked) return;
    if (code.length < LENGTH) return setError(`Der Code hat ${LENGTH} Zeichen.`);
    // Die Prüfziffer fängt Tippfehler ab, bevor überhaupt ein Server gefragt wird.
    if (checkChar(code.slice(0, -1)) !== code.at(-1)) return fail("Der Code enthält einen Tippfehler.");
    if (redeemed.includes(code)) return fail("Dieser Gutschein wurde bereits eingelöst.");
    if (code !== DEMO_CODE) return fail("Diesen Gutschein kennen wir nicht.");
    setError("");
    await submit();
    setRedeemed((list) => [...list, code]);
  };

  const again = () => {
    setCode("");
    reset();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-rose-400 via-orange-300 to-amber-200 p-6 text-rose-950">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white/90 p-8 shadow-2xl">
          <p className="text-sm font-bold text-rose-700">Buchladen Seitenreich</p>
          <h2 className="mt-1 text-3xl font-black">Gutschein einlösen</h2>

          {status === "done" ? (
            <div role="status" className="mt-6 rounded-2xl bg-rose-700 p-6 text-center text-white">
              <p className="text-sm uppercase tracking-widest">Guthaben</p>
              <p className="text-5xl font-black tabular-nums">{euro(VALUE)}</p>
              <p className="mt-2 text-sm">wurde deinem Konto gutgeschrieben.</p>
              <button type="button" onClick={again} className="mt-4 text-sm underline">
                Weiteren Gutschein einlösen
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-6">
              <label className="block text-sm font-semibold">
                Gutscheincode
                <input
                  disabled={locked}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  placeholder="XXXX-XXXX-XXXX"
                  aria-describedby="voucher-hint"
                  className="mt-1 w-full rounded-2xl border-2 border-dashed border-rose-300 bg-white px-4 py-4 text-center font-mono text-2xl tracking-widest focus:border-solid focus:border-rose-700 focus:outline-none disabled:bg-neutral-100"
                  value={format(code)}
                  onChange={onChange}
                />
              </label>
              <p id="voucher-hint" className="mt-2 text-xs text-rose-900/70">
                12 Zeichen von der Rückseite der Karte. Bindestriche setzen wir automatisch.
              </p>

              {error && (
                <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
                  {error}
                  {attempts > 0 && !locked && ` Noch ${MAX_ATTEMPTS - attempts} Versuch(e).`}
                </p>
              )}
              {locked && (
                <p role="alert" className="mt-3 rounded-xl bg-red-100 p-3 text-sm text-red-900">
                  Zu viele Fehlversuche. Bitte wende dich an den Kundenservice.
                </p>
              )}

              <button
                type="submit"
                disabled={locked || status === "sending"}
                className="mt-5 w-full rounded-2xl bg-rose-700 px-5 py-3 font-bold text-white hover:bg-rose-800 disabled:opacity-50"
              >
                {status === "sending" ? "Wird geprüft …" : "Einlösen"}
              </button>
              <p className="mt-4 border-t border-rose-200 pt-3 text-center text-xs text-rose-900/70">
                Demo-Code: {format(DEMO_CODE)}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
