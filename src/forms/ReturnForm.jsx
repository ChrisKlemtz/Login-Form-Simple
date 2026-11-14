import { useState } from "react";
import { euro, isGermanZip, useFakeSubmit } from "../lib/form.js";

const DEMO_ORDER = {
  number: "LW-204817",
  zip: "20095",
  items: [
    { id: "a", name: "Laufschuh Tempo 3, Gr. 43", price: 139.95 },
    { id: "b", name: "Funktionsshirt, Gr. M", price: 34.95 },
    { id: "c", name: "Laufsocken, 3er-Pack", price: 14.95 },
  ],
};
const REASONS = ["Zu klein", "Zu groß", "Gefällt nicht", "Defekt oder beschädigt", "Falscher Artikel"];

const input =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 focus:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500/30";

export default function ReturnForm() {
  const [number, setNumber] = useState("");
  const [zip, setZip] = useState("");
  const [order, setOrder] = useState(null);
  const [reasons, setReasons] = useState({}); // { [itemId]: Grund } für ausgewählte Artikel
  const [refund, setRefund] = useState("original");
  const [error, setError] = useState("");
  const lookup = useFakeSubmit(800);
  const send = useFakeSubmit(1000);

  const selected = order ? order.items.filter((item) => item.id in reasons) : [];
  const total = selected.reduce((sum, item) => sum + item.price, 0);

  const onLookup = async (e) => {
    e.preventDefault();
    if (!/^LW-\d{6}$/.test(number)) return setError("Die Bestellnummer hat das Format LW-123456.");
    if (!isGermanZip(zip)) return setError("Bitte die Postleitzahl der Lieferadresse angeben.");
    setError("");
    await lookup.submit();
    lookup.reset();
    // Eine Meldung für beide Fälle: So lässt sich nicht erraten, welche Bestellnummern existieren.
    if (number !== DEMO_ORDER.number || zip !== DEMO_ORDER.zip)
      return setError("Zu diesen Angaben haben wir keine Bestellung gefunden.");
    setOrder(DEMO_ORDER);
  };

  const toggle = (id) =>
    setReasons((r) => {
      if (!(id in r)) return { ...r, [id]: "" };
      const next = { ...r };
      delete next[id];
      return next;
    });

  const onSend = async (e) => {
    e.preventDefault();
    if (selected.length === 0) return setError("Bitte mindestens einen Artikel auswählen.");
    if (selected.some((item) => !reasons[item.id])) return setError("Bitte für jeden Artikel einen Grund wählen.");
    setError("");
    await send.submit();
  };

  const restart = () => {
    setOrder(null);
    setReasons({});
    setNumber("");
    setZip("");
    send.reset();
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-900 p-6 text-zinc-900">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white">
        <div className="flex items-center justify-between bg-lime-400 px-6 py-4">
          <p className="text-lg font-black italic tracking-tight">LAUFWERK</p>
          <p className="text-sm font-semibold">Rücksendung</p>
        </div>

        <div className="p-6">
          {send.status === "done" ? (
            <div role="status">
              <h2 className="text-xl font-bold">Rücksendung angemeldet.</h2>
              <p className="mt-2 text-sm text-zinc-700">
                {selected.length} Artikel, Erstattung {euro(total)}{" "}
                {refund === "original" ? "auf die ursprüngliche Zahlungsart" : "als Gutschein"}.
              </p>
              <p className="mt-4 rounded-md border-2 border-dashed border-zinc-300 p-4 text-center font-mono text-lg tracking-widest">
                RET-{order.number.slice(3)}-01
              </p>
              <p className="mt-2 text-xs text-zinc-500">Zeige diesen Code in der Filiale oder im Paketshop vor.</p>
              <button type="button" onClick={restart} className="mt-4 text-sm underline">
                Weitere Rücksendung
              </button>
            </div>
          ) : !order ? (
            <form onSubmit={onLookup} noValidate className="space-y-4">
              <h2 className="text-xl font-bold">Bestellung finden</h2>
              <label className="block text-sm font-semibold">
                Bestellnummer
                <input
                  className={`${input} font-mono`}
                  placeholder="LW-123456"
                  autoComplete="off"
                  value={number}
                  onChange={(e) => setNumber(e.target.value.toUpperCase().slice(0, 9))}
                />
              </label>
              <label className="block text-sm font-semibold">
                Postleitzahl der Lieferadresse
                <input
                  className={input}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                />
              </label>
              {error && (
                <p role="alert" className="text-sm text-red-700">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={lookup.status === "sending"}
                className="w-full rounded-md bg-zinc-900 px-5 py-3 font-bold text-white hover:bg-zinc-700 disabled:opacity-60"
              >
                {lookup.status === "sending" ? "Suche …" : "Bestellung suchen"}
              </button>
              <p className="text-xs text-zinc-500">
                Demo: {DEMO_ORDER.number} mit PLZ {DEMO_ORDER.zip}
              </p>
            </form>
          ) : (
            <form onSubmit={onSend} noValidate className="space-y-5">
              <h2 className="text-xl font-bold">Was möchtest du zurückschicken?</h2>
              <ul className="space-y-3">
                {order.items.map((item) => {
                  const active = item.id in reasons;
                  return (
                    <li key={item.id} className={`rounded-md border-2 p-3 ${active ? "border-lime-500" : "border-zinc-200"}`}>
                      <label className="flex items-center justify-between gap-3 text-sm font-semibold">
                        <span className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-lime-600"
                            checked={active}
                            onChange={() => toggle(item.id)}
                          />
                          {item.name}
                        </span>
                        <span className="tabular-nums">{euro(item.price)}</span>
                      </label>
                      {active && (
                        <label className="mt-2 block text-sm">
                          <span className="sr-only">Grund für {item.name}</span>
                          <select
                            className={input}
                            value={reasons[item.id]}
                            onChange={(e) => setReasons({ ...reasons, [item.id]: e.target.value })}
                          >
                            <option value="">Grund wählen</option>
                            {REASONS.map((reason) => (
                              <option key={reason}>{reason}</option>
                            ))}
                          </select>
                        </label>
                      )}
                    </li>
                  );
                })}
              </ul>

              <fieldset>
                <legend className="text-sm font-semibold">Erstattung</legend>
                <div className="mt-2 space-y-1.5 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="refund"
                      className="accent-lime-600"
                      checked={refund === "original"}
                      onChange={() => setRefund("original")}
                    />
                    Auf die ursprüngliche Zahlungsart
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="refund"
                      className="accent-lime-600"
                      checked={refund === "voucher"}
                      onChange={() => setRefund("voucher")}
                    />
                    Als Gutschein (sofort verfügbar)
                  </label>
                </div>
              </fieldset>

              {error && (
                <p role="alert" className="text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
                <p aria-live="polite" className="text-sm">
                  Erstattung <strong className="text-lg tabular-nums">{euro(total)}</strong>
                </p>
                <button
                  type="submit"
                  disabled={send.status === "sending"}
                  className="rounded-md bg-lime-400 px-5 py-3 font-bold hover:bg-lime-300 disabled:opacity-60"
                >
                  {send.status === "sending" ? "Sendet …" : "Rücksendung anmelden"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
