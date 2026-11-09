import { usePortal } from '../lib/portal-context';
import { Await, External } from './Bits';

/** District context never contributes office-wide figures to the city's title search. */
export default function DistrictContext() {
  const { config, districts } = usePortal();
  if (!config.scope.districts?.length) return null;
  return (
    <section
      className="section district-section"
      aria-labelledby="district-context-h"
    >
      <h2 id="district-context-h" className="section-h">
        Tagaytay’s district
      </h2>
      <Await state={districts} what="the district context">
        {cards =>
          cards.map(({ data: district, meta }) => {
            const representative = district.representative;
            const portrait = representative?.portrait;
            return (
              <article className="district-context" key={district.id}>
                <div className="district-description">
                  <p className="label">Legislative district</p>
                  <h3>{district.label}</h3>
                  <p>
                    {district.offices.map(office => office.name).join(' · ')}
                  </p>
                  <p className="small muted">
                    District and office coverage extends beyond Tagaytay. The
                    totals above include only the portal’s matching entries.
                  </p>
                  <External href={district.url}>Explore district data</External>
                </div>
                {representative && (
                  <div className="district-member">
                    {portrait && (
                      <img
                        src={portrait.url}
                        alt={`Portrait of ${representative.name}`}
                        width="80"
                        height="100"
                        loading="lazy"
                      />
                    )}
                    <div>
                      <p className="label">Representative · 20th Congress</p>
                      <p className="member-name">{representative.name}</p>
                      {representative.profile_url && (
                        <External href={representative.profile_url}>
                          House profile
                        </External>
                      )}
                      {portrait && (
                        <p className="portrait-credit">
                          <a href={portrait.source_url}>
                            {portrait.attribution} · {portrait.license}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {typeof meta.representatives_note === 'string' && (
                  <p className="district-note">{meta.representatives_note}</p>
                )}
              </article>
            );
          })
        }
      </Await>
    </section>
  );
}
