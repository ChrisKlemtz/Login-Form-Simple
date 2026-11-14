import { useMemo, useState } from "react";
import { euro } from "../lib/form.js";

const LISTINGS = [
  { id: 1, title: "Helle Altbauwohnung", area: "Eimsbüttel", rooms: 3, size: 82, rent: 1450, tags: ["Balkon", "Einbauküche"] },
  { id: 2, title: "Studio am Kanal", area: "Winterhude", rooms: 1, size: 34, rent: 720, tags: ["Einbauküche", "Aufzug"] },
  { id: 3, title: "Familienwohnung mit Garten", area: "Volksdorf", rooms: 4, size: 110, rent: 1890, tags: ["Garten", "Einbauküche"] },
  { id: 4, title: "Dachgeschoss mit Blick", area: "Ottensen", rooms: 2, size: 58, rent: 1180, tags: ["Balkon"] },
  { id: 5, title: "Neubau am Park", area: "Barmbek", rooms: 3, size: 76, rent: 1620, tags: ["Balkon", "Aufzug", "Einbauküche"] },
  { id: 6, title: "Kompakte Stadtwohnung", area: "St. Georg", rooms: 2, size: 47, rent: 980, tags: ["Aufzug"] },
  { id: 7, title: "Loft in alter Fabrik", area: "Bahrenfeld", rooms: 2, size: 95, rent: 1750, tags: ["Einbauküche"] },
  { id: 8, title: "Ruhige Erdgeschosswohnung", area: "Niendorf", rooms: 3, size: 71, rent: 1090, tags: ["Garten"] },
  { id: 9, title: "Apartment für Pendler", area: "Altona", rooms: 1, size: 28, rent: 640, tags: ["Einbauküche"] },
];

const FEATURES = ["Balkon", "Garten", "Aufzug", "Einbauküche"];
const DEFAULTS = { query: "", maxRent: 2000, minRooms: 1, features: [], sort: "rent-asc" };

const SORTERS = {
  "rent-asc": (a, b) => a.rent - b.rent,
  "rent-desc": (a, b) => b.rent - a.rent,
  "size-desc": (a, b) => b.size - a.size,
};

export default function SearchFilterForm() {
  const [filters, setFilters] = useState(DEFAULTS);
  const set = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  const results = useMemo(() => {
    // Die Eingabe wird nur als Text verglichen, nie als Code oder Muster ausgeführt.
    const query = filters.query.trim().toLowerCase();
    return LISTINGS.filter(
      (l) =>
        (!query || `${l.title} ${l.area}`.toLowerCase().includes(query)) &&
        l.rent <= filters.maxRent &&
        l.rooms >= filters.minRooms &&
        filters.features.every((f) => l.tags.includes(f)),
    ).sort(SORTERS[filters.sort]);
  }, [filters]);

  const toggleFeature = (feature) =>
    set(
      "features",
      filters.features.includes(feature)
        ? filters.features.filter((f) => f !== feature)
        : [...filters.features, feature],
    );

  const changed = JSON.stringify(filters) !== JSON.stringify(DEFAULTS);

  return (
    <div className="flex flex-1 items-start justify-center bg-[#f6f1ea] p-6 text-stone-900">
      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-[17rem_1fr]">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="h-fit rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-orange-700">Wohnraum</p>
          <h2 className="mt-1 text-xl font-bold">Mietwohnungen in Hamburg</h2>

          <label className="mt-5 block text-sm font-semibold">
            Suche
            <input
              type="search"
              maxLength={60}
              placeholder="Stadtteil oder Stichwort"
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20"
              value={filters.query}
              onChange={(e) => set("query", e.target.value)}
            />
          </label>

          <label className="mt-5 block text-sm font-semibold">
            Miete bis {euro(filters.maxRent)}
            <input
              type="range"
              min="600"
              max="2000"
              step="50"
              className="mt-2 w-full accent-orange-600"
              value={filters.maxRent}
              onChange={(e) => set("maxRent", Number(e.target.value))}
            />
          </label>

          <fieldset className="mt-5">
            <legend className="text-sm font-semibold">Zimmer mindestens</legend>
            <div className="mt-2 grid grid-cols-4 gap-1">
              {[1, 2, 3, 4].map((n) => (
                <label
                  key={n}
                  className={`cursor-pointer rounded-lg border py-1.5 text-center text-sm font-semibold focus-within:ring-2 focus-within:ring-orange-600 ${
                    filters.minRooms === n ? "border-orange-600 bg-orange-600 text-white" : "border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="rooms"
                    className="sr-only"
                    checked={filters.minRooms === n}
                    onChange={() => set("minRooms", n)}
                  />
                  {n}+
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-sm font-semibold">Ausstattung</legend>
            <div className="mt-2 space-y-1.5">
              {FEATURES.map((feature) => (
                <label key={feature} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-orange-600"
                    checked={filters.features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            disabled={!changed}
            onClick={() => setFilters(DEFAULTS)}
            className="mt-5 text-sm font-semibold text-orange-700 underline disabled:text-stone-400 disabled:no-underline"
          >
            Filter zurücksetzen
          </button>
        </form>

        <section aria-label="Suchergebnisse">
          <div className="flex items-center justify-between">
            <p role="status" className="font-semibold">
              {results.length} {results.length === 1 ? "Wohnung" : "Wohnungen"} gefunden
            </p>
            <label className="text-sm">
              <span className="sr-only">Sortierung</span>
              <select
                className="rounded-lg border border-stone-300 bg-white px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-600/30"
                value={filters.sort}
                onChange={(e) => set("sort", e.target.value)}
              >
                <option value="rent-asc">Miete aufsteigend</option>
                <option value="rent-desc">Miete absteigend</option>
                <option value="size-desc">Größte zuerst</option>
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <p className="mt-4 rounded-2xl border-2 border-dashed border-stone-300 p-8 text-center text-stone-600">
              Keine Treffer. Erhöhe die Miete oder nimm einen Filter heraus.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {results.map((l) => (
                <li key={l.id} className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">{l.area}</p>
                  <h3 className="mt-0.5 font-bold">{l.title}</h3>
                  <p className="mt-1 text-sm tabular-nums text-stone-600">
                    {l.rooms} Zimmer · {l.size} m²
                  </p>
                  <p className="mt-2 text-lg font-bold tabular-nums">{euro(l.rent)}</p>
                  <p className="mt-1 text-xs text-stone-500">{l.tags.join(" · ")}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
