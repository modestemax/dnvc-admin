'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterCreate(result, data) {
      console.log(result, data)
      debugger
    },
    async afterUpdate(result, data) {
      console.log(result, data)
      debugger
    }
  }
};
