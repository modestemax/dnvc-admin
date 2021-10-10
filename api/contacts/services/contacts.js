'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async sendActivationRequest({to, dynamic_template_data}) {

    await strapi.services.email.send({
      to, dynamic_template_data,
      template_id: process.env.CONTACT_ACTIVATION_REQUEST_EMAIL_TEMPLATE_ID,
    });

  }
};
