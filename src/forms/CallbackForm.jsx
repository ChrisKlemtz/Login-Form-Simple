import { useEffect, useState } from "react";
import { isPhone, useFakeSubmit } from "../lib/form.js";

const STORAGE_KEY = "collection-forms:callback-until";
const COOLDOWN_SECONDS = 60;

// localStorage kann blockiert sein (privater Modus), deshalb immer abgesichert.
const readUntil = () => {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
};

const writeUntil = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // ohne Speicher gilt die Sperre nur bis zum Neuladen
  }
};

const input =
  "mt-1 w-full border-[3px] border-black bg-white px-3 py-3 text-lg font-bold focus:bg-yellow-200 focus:outline-none";

export default function CallbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("So bald wie möglich");
  const [until, setUntil] = useState(readUntil);
  const [now, setNow] = useState(Date.now);
  const [error, setError] = useState("");
  const { status, submit } = useFakeSubmit(700);

  const remaining = Math.max(0, Math.ceil((until - now) / 1000));

  useEffect(() => {
    if (until <= Date.now()) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [until]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (remaining > 0) return;
    if (name.trim().length < 2) return setError("Bitte Namen angeben.");
    if (!isPhone(phone)) return setError("Bitte eine gültige Telefonnummer angeben.");
    setError("");
    await submit();
    const next = Date.now() + COOLDOWN_SECONDS * 1000;
    writeUntil(next);
    setNow(Date.now());
    setUntil(next);
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-[#fde047] p-6 text-black">
      <div className="w-full max-w-sm border-[3px] border-black bg-white p-6 shadow-[8px_8px_0_0_#000]">
        <p className="inline-block border-[3px] border-black bg-black px-2 py-1 text-sm font-black uppercase text-[#fde047]">
          Dachdecker Brandt
        </p>
        <h2 className="mt-4 text-3xl font-black leading-tight">Wir rufen zurück.</h2>
        <p className="mt-1 font-medium">Zwei Felder, fertig.</p>

        <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
          <label className="block text-sm font-black uppercase">
            Name
            <input className={input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block text-sm font-black uppercase">
            Telefon
            <input
              className={input}
              type="tel"
              autoComplete="tel"
              placeholder="0170 1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <label className="block text-sm font-black uppercase">
            Wann passt es?
            <select className={input} value={time} onChange={(e) => setTime(e.target.value)}>
              <option>So bald wie möglich</option>
              <option>Vormittags</option>
              <option>Nachmittags</option>
              <option>Nach 17 Uhr</option>
            </select>
          </label>

          {error && (
            <p role="alert" className="border-[3px] border-black bg-red-400 p-2 font-bold">
              {error}
            </p>
          )}

          {remaining > 0 && (
            <p role="status" className="border-[3px] border-black bg-green-300 p-2 font-bold">
              Anfrage ist raus. Weitere Anfrage möglich in <span className="tabular-nums">{remaining}</span> s.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending" || remaining > 0}
            className="w-full border-[3px] border-black bg-[#fde047] px-5 py-3 text-lg font-black uppercase shadow-[4px_4px_0_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] disabled:translate-x-0 disabled:translate-y-0 disabled:bg-neutral-200 disabled:shadow-none"
          >
            {status === "sending" ? "Sendet …" : remaining > 0 ? "Bitte warten" : "Rückruf anfordern"}
          </button>
        </form>
      </div>
    </div>
  );
}
