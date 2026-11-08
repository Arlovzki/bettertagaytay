import { Facebook, Github, Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VisitCounter from '../VisitCounter';
import RidgeDivider from '../ui/RidgeDivider';
import terrain from '../../data/terrain.json';

export default function Footer() {
  const { t } = useTranslation('common');

  const QUICK_LINKS = [
    { labelKey: 'nav.services', href: '/services' },
    { labelKey: 'records.title', href: '/documents' },
    { labelKey: 'nav.government', href: '/government/departments' },
    {
      labelKey: 'nav.transparency',
      href: '/government/transparency-documents',
    },
    {
      labelKey: 'nav.fullDisclosure',
      href: '/government/transparency-documents/full-disclosure',
    },
    {
      labelKey: 'nav.foiReleases',
      href: '/government/transparency-documents/foi-releases',
    },
    { labelKey: 'contact.title', href: '/#contact' },
  ];

  const RESOURCES = [
    { label: 'Open Data Philippines', href: 'https://data.gov.ph' },
    { label: 'Freedom of Information', href: 'https://www.foi.gov.ph' },
    { label: 'Official Tagaytay Website', href: 'https://www.tagaytay.gov.ph' },
    { label: 'DILG FDP Portal', href: 'https://fdpp.blgs.gov.ph' },
    { label: 'PhilGEPS', href: 'https://www.philgeps.gov.ph' },
    { label: 'Official Gov.ph', href: 'https://www.gov.ph' },
  ];

  return (
    <footer className="bg-white">
      <RidgeDivider variant="footer" />
      <div className="bg-primary-950 text-white" data-tone="inverse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-9 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-9 gap-y-8 mb-9">
            <div>
              <img
                src="/logo.png"
                alt="BetterTagaytay"
                width="1692"
                height="608"
                className="h-11 w-auto brightness-0 invert mb-4"
                loading="lazy"
              />
              <p className="text-primary-200 text-sm leading-relaxed mb-4">
                {t('footer.independent')}
              </p>
              <p className="text-primary-200 text-xs leading-relaxed mb-4">
                <a
                  href={terrain.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-white"
                >
                  {t('terrain.credit', { interval: terrain.intervalMetres })}
                </a>
                <br />
                {terrain.displayCredit}
              </p>
              <div className="flex gap-2 mb-3">
                {[
                  {
                    label: 'Facebook',
                    href: 'https://web.facebook.com/bettertagaytay',
                    icon: Facebook,
                  },
                  {
                    label: 'GitHub',
                    href: 'https://github.com/Arlovzki/bettertagaytay',
                    icon: Github,
                  },
                  {
                    label: 'Discord',
                    href: 'https://discord.gg/bettergovph',
                    icon: MessageCircle,
                  },
                ].map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex items-center justify-center h-11 w-11 rounded-lg text-primary-200 hover:bg-primary-800 hover:text-white transition-colors"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                ))}
              </div>
              <a
                href="https://bettergov.ph"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center min-h-11 text-sm text-primary-200 hover:text-white underline underline-offset-4"
              >
                BetterGov.ph
              </a>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                {t('footer.quickLinks')}
              </h3>
              <ul>
                {QUICK_LINKS.map(link => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="inline-flex items-center min-h-11 text-primary-200 hover:text-white text-sm transition-colors"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                {t('footer.resources')}
              </h3>
              <ul>
                {RESOURCES.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center min-h-11 text-primary-200 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-5">
                <VisitCounter />
              </div>
              <p className="text-sm text-primary-200 mb-5">
                {t('footer.costLabel')}{' '}
                <strong className="text-white">₱0</strong>
              </p>
              <div className="flex flex-col items-start gap-3">
                <a
                  href="https://github.com/Arlovzki/bettertagaytay"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-600 px-4 py-2.5 rounded-lg transition-colors"
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  {t('footer.volunteer')}
                </a>
                <a
                  href="https://github.com/Arlovzki/bettertagaytay"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-200 hover:text-white underline underline-offset-4"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  {t('footer.contribute')}
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-700 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs leading-relaxed text-primary-200">
            <p>
              © {new Date().getFullYear()} BetterTagaytay.org · MIT · CC BY 4.0
            </p>
            <a
              href="https://www.arloubeloria.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 hover:text-white transition-colors"
            >
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              {t('footer.builtBy')} Arlou Beloria
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
