import type { DayItem } from "./day-by-day";

/**
 * Structured comparison table of the day-by-day specs.
 *
 * A real <table> with <th scope> — the format answer engines and featured
 * snippets extract most reliably for "distance / altitude per day" queries.
 */
export function ItineraryTable({
  days,
  caption,
}: {
  days: DayItem[];
  caption: string;
}) {
  if (days.length === 0) return null;
  const showDistance = days.some((d) => d.distance);
  const showDuration = days.some((d) => d.duration);
  const showAltitude = days.some((d) => d.altitude);
  const showStay = days.some((d) => d.accommodation);

  return (
    <div className="table-scroll">
      <table>
        <caption className="px-4 py-3 text-left text-sm text-ink-600">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Stage</th>
            {showDistance && <th scope="col">Distance</th>}
            {showDuration && <th scope="col">Walking time</th>}
            {showAltitude && <th scope="col">Max altitude</th>}
            {showStay && <th scope="col">Overnight</th>}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.id}>
              <th scope="row" className="font-bold text-ink-900">
                {day.dayNumber}
              </th>
              <td className="font-medium text-ink-800">{day.title}</td>
              {showDistance && <td>{day.distance || "—"}</td>}
              {showDuration && <td>{day.duration || "—"}</td>}
              {showAltitude && <td>{day.altitude || "—"}</td>}
              {showStay && <td>{day.accommodation || "—"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
