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
  siteUrl: 'https://syncvizion.github.io/demo-app',
  apiUrl: 'https://api-card-market.syncvizion.com',
  companyFolder: 'demo',
  companyName: 'SyncVizion',
  auth0Domain: 'card-market.syncvizion.com',
  auth0ClientId: 'mWkCWZP24xt10FB42rthr5XkjLSpeEnI',
  auth0Audience: 'card-market-local.api',
  auth0AllowedList: [
    'http://localhost:4200*',
    'https://api-card-market.syncvizion.com*',
    'https://syncvizion.github.io/demo-app*',
  ],
  stripePublicKey:
    'pk_test_51TOj3mJ3gCeS38ukSwZ65Nxn5Rj5QWebiU0CkUoadyHTUH0RrcKpuDl7h708sIgdoQkgl52w6fhRvXCmPaNf8WSA00TM3b1wC0',
};
