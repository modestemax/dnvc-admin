'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = () => {
  strapi.admin.services.permission.conditionProvider.register({
    displayName: 'Billing amount under 10K',
    name: 'billing-amount-under-10k',
    plugin: 'admin',
    handler: {amount: {$lt: 10000}},
  });
};
