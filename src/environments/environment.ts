/**
 * Default configuration for running the application locally. This requires the
 * card-market-microservice to be running locally as well and requires a locally
 * signed jwt.
 *
 * @author Sam Butler
 * @since February 25, 2022
 */
export const environment = {
  tag: 'LOCAL',
  production: false,
  isLocal: true,
  siteUrl: 'localhost:4200',
  apiUrl: 'localhost:4200',
  // apiUrl: 'https://api-card-market.syncvizion.com',
  companyFolder: 'demo',
  companyName: 'SyncVizion',
  auth0Domain: 'card-market.syncvizion.com',
  auth0ClientId: 'mWkCWZP24xt10FB42rthr5XkjLSpeEnI',
  auth0Audience: 'card-market-local.api',
  auth0AllowedList: ['http://localhost:4200*', 'https://api-card-market.syncvizion.com*'],
  stripePublicKey: '',
};
