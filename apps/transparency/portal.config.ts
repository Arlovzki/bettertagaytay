import { defineConfig } from './src/config.ts';
import exclusions from './src/data/exclusions.json' with { type: 'json' };

export default defineConfig({
  id: 'tagaytay-city',
  kind: 'city',
  name: 'Tagaytay Transparency Portal',
  shortName: 'Tagaytay',
  operator: {
    name: 'BetterTagaytay',
    url: 'https://bettertagaytay.org',
    email: 'arloubeloria@gmail.com',
  },
  logo: '/brand/bettertagaytay.png',
  siteUrl: 'https://transparency.bettertagaytay.org',
  shareImage: '/brand/transparency-share.png',
  buildYourOwnStrip: false,
  scope: {
    offices: [],
    places: [{ label: 'Tagaytay', region: 'IV-A' }],
    districts: ['leg:cavite:8th'],
    exclude: exclusions,
  },
  reporting: { enabled: false },
});
