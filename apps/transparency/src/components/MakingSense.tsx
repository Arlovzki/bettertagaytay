import { Link } from 'react-router-dom';
import type { ScopedProject, Summary } from '../lib/scope';
import { houseBreakdown } from '../lib/insights';
import { count, php, phpFull, plural } from '../lib/format';

const percent = (share: number) =>
  `${(share * 100).toLocaleString('en-PH', { maximumFractionDigits: 1 })}%`;
const COMPARISONS = [
  ['unchanged', 'Same amount in both versions'],
  ['house_only', 'Listed only in the House bill'],
  ['nep_only', 'Listed only in the NEP'],
  ['increased', 'Higher amount in the House bill'],
  ['decreased', 'Lower amount in the House bill'],
  ['scope_review', 'Different road sections; amounts are not comparable'],
] as const;

export default function MakingSense({
  projects,
  summary,
}: {
  projects: readonly ScopedProject[];
  summary: Summary;
}) {
  const breakdown = houseBreakdown(projects);
  const largest = breakdown.categories[0];
  const largestType = largest?.label.toLowerCase().replace(' & ', ' and ');
  const uncertain = projects.filter(project => project.held).length;
  return (
    <section
      id="making-sense"
      className="section making-sense"
      aria-labelledby="making-sense-h"
    >
      <div className="sense-heading">
        <h2 id="making-sense-h">Making sense of the budget</h2>
        <p>What the proposals mean, in everyday language.</p>
      </div>
      <div className="sense-grid">
        <article className="sense-card" aria-labelledby="proposed-types-h">
          <h3 id="proposed-types-h">What is being proposed?</h3>
          <p className="sense-intro">
            {plural(breakdown.entries, 'entry', 'entries')} in the House bill ·{' '}
            {php(breakdown.total)} in proposed funding.
          </p>
          {breakdown.categories.length ? (
            <ul className="sense-bars">
              {breakdown.categories.map(category => (
                <li key={category.id}>
                  <Link
                    className="sense-category"
                    to={`/?category=${category.id}&version=house#projects`}
                  >
                    <span className="sense-bar-title">
                      <span>{category.label}</span>
                      <strong title={phpFull(category.amount)}>
                        {php(category.amount)}
                      </strong>
                    </span>
                    <span className="sense-track" aria-hidden="true">
                      <span style={{ width: `${category.share * 100}%` }} />
                    </span>
                    <span className="sense-bar-meta">
                      {plural(category.entries, 'entry', 'entries')} ·{' '}
                      {percent(category.share)} of the displayed House amount
                      {category.uncertain > 0 && (
                        <>
                          {' '}
                          ·{' '}
                          {plural(
                            category.uncertain,
                            'uncertain match',
                            'uncertain matches'
                          )}
                        </>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No House bill entries are listed in this snapshot. The comparison
              table still shows the other version.
            </p>
          )}
          {largest && breakdown.total > 0 && (
            <p className="sense-takeaway">
              <strong>In plain language:</strong> Of every ₱100 in the House
              proposal shown here, about ₱{Math.round(largest.share * 100)} is
              for {largestType}.
            </p>
          )}
          <p className="sense-footnote">
            Groups use the project title and program, not official sector codes.
            Select a category to see its House bill entries. Connecting roads
            can extend outside Tagaytay.
          </p>
        </article>

        <article
          className="sense-card sense-guide"
          aria-labelledby="reading-budget-h"
        >
          <h3 id="reading-budget-h">How to read the figures</h3>
          <dl className="sense-terms">
            <div>
              <dt>NEP</dt>
              <dd>The President’s proposed national budget.</dd>
            </div>
            <div>
              <dt>House bill</dt>
              <dd>
                The House of Representatives’ proposed version. Compare it with
                the NEP; do not add the two amounts.
              </dd>
            </div>
            <div>
              <dt>GAA</dt>
              <dd>
                The enacted budget, shown in the 2020–2026 section. It
                authorizes spending but does not show money already paid.
              </dd>
            </div>
          </dl>
          <h4>What the comparison shows</h4>
          <ul className="sense-comparison">
            {COMPARISONS.filter(
              ([group]) => summary.groups[group].rows > 0
            ).map(([group, label]) => (
              <li key={group}>
                <Link to={`/?status=${group}#projects`}>
                  <strong>{count(summary.groups[group].rows)}</strong>
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="sense-footnote">
            A one-version entry may be new, renamed or matched differently. It
            is a lead to check, not proof of wrongdoing.
            {uncertain > 0 && (
              <>
                {' '}
                These counts include{' '}
                {plural(uncertain, 'uncertain match', 'uncertain matches')}.
              </>
            )}
          </p>
          <p className="sense-takeaway">
            <strong>These are not spending records.</strong> The figures show
            proposals, not money already spent. Open a project to check its
            source document.
          </p>
          <details className="sense-number-key">
            <summary>What do M and B mean?</summary>
            <p>
              M means million: ₱1M = ₱1,000,000. B means billion: ₱1B =
              ₱1,000,000,000.
            </p>
            <p>
              The exact House bill total shown here is{' '}
              <strong>{phpFull(breakdown.total)}</strong>.
            </p>
          </details>
        </article>
      </div>
    </section>
  );
}
