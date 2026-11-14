/**
 * Honeypot-Feld: für Menschen unsichtbar und nicht per Tab erreichbar.
 * Bots, die alle Felder ausfüllen, verraten sich über diesen Wert.
 */
export default function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      <label>
        Website (bitte leer lassen)
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
