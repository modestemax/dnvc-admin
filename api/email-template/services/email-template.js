'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async getByApiName(apiname) {
    const emailTemplateModel = strapi.models["email-template"]

    return await emailTemplateModel.where('api_name', apiname).fetch()

  }
};
