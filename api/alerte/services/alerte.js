'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {

  async publish_sendgrid(alert, contacts) {
    await strapi.services.email.send({
      to: contacts.map(c => ({email: c.Email, name: `${c.Nom} ${c.Prenom}`})),
      dynamic_template_data: {},
      template_id: process.env.CONTACT_ACTIVATION_REQUEST_EMAIL_TEMPLATE_ID,
    });
  },

  async publish(alert, contacts) {
    try {
      console.log('sending email to ',contacts.map(c => ({email: c.Email, name: `${c.Nom} ${c.Prenom}`})))
      await strapi.plugins.email.services
        .email.send({
          to: contacts.map(c => ({email: c.Email, name: `${c.Nom} ${c.Prenom}`})),
          subject: alert.Title, text: alert.Resume, html: alert.Resume
        });
    } catch (ex) {
      console.log('email error ', ex)
    }

  }

};
