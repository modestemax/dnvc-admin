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

    const to = contacts.map(c => ({email: c.Email, name: `${c.Nom} ${c.Prenom}`}));
    console.log('sending email to ', to)
    for (const to1 of to) {
      try {
        await strapi.plugins.email.services
          .email.send({
            to: [to1],
            subject: alert.Title,
            text: alert.Resume,
            html: alert.Resume
          });
        console.log('mail sent to ', to1)
        await sleep(1e3)
      } catch (ex) {
        console.log('email error ', ex)
      }
    }

    function sleep(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms)
      })
    }

  }

};
