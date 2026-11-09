type ReportPeriod = { id: string; year: number; label: string };

export default function CityReportControls({
  periods,
  selected,
  onSelect,
}: {
  periods: readonly ReportPeriod[];
  selected: ReportPeriod;
  onSelect: (id: string) => void;
}) {
  const years = [...new Set(periods.map(item => item.year))];
  const yearPeriods = periods.filter(item => item.year === selected.year);
  return (
    <div className="city-summary-controls">
      <div className="toolbar">
        <label className="field">
          <span className="label">Summary year</span>
          <select
            value={selected.year}
            onChange={event => {
              const next = periods.find(
                item => item.year === Number(event.target.value)
              );
              if (next) onSelect(next.id);
            }}
          >
            {years.map(year => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </label>
        <label className="field field-grow">
          <span className="label">Report period</span>
          <select
            value={selected.id}
            onChange={event => onSelect(event.target.value)}
          >
            {yearPeriods.map(period => (
              <option key={period.id} value={period.id}>
                {period.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <a className="button button-quiet" href="#city-documents">
        Browse official documents
      </a>
    </div>
  );
}
