import {
  centavos,
  citySource,
  developmentCoverage,
  type CityReview,
} from '../lib/city-finances';

export default function CityDevelopment({
  development,
}: {
  development: NonNullable<CityReview['development']>;
}) {
  const source = citySource(development.sourceId);
  const developmentPage = `${source.url}#page=${development.sourcePage}`;
  const coverage = developmentCoverage(development.projects);
  return (
    <details className="city-project-details">
      <summary>
        See all {development.projects.length} projects and reported costs
      </summary>
      <div className="city-table-wrap">
        <table className="city-project-table">
          <caption className="sr-only">
            Projects transcribed from the selected Development Fund return, page
            1
          </caption>
          <thead>
            <tr>
              <th scope="col">Project and location</th>
              <th scope="col">Listed cost</th>
              <th scope="col">Cost incurred to date</th>
            </tr>
          </thead>
          <tbody>
            {development.projects.map(project => (
              <tr key={project.id}>
                <th scope="row">
                  {project.label}
                  <span>{project.location}</span>
                </th>
                <td data-label="Listed cost">
                  {centavos(project.costCentavos)}
                </td>
                <td data-label="Cost incurred to date">
                  {centavos(project.incurredCentavos)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="fine">
        “Not stated in report” means the city’s PDF has no numeric amount for
        that field. The {centavos(coverage.listedCost)} in project costs plus
        the balance row reconcile to the printed total of{' '}
        {centavos(development.printedTotalCentavos)}.{' '}
        <a href={developmentPage} target="_blank" rel="noopener">
          Read the original project entries ↗
        </a>
      </p>
    </details>
  );
}
