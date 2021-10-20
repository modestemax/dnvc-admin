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
    let etpl = await strapi.services['email-template'].getByApiName('alerte')
    if (etpl) {
      etpl = etpl.toJSON()
      const to = contacts.map(c => ({email: c.Email, name: `${c.Nom} ${c.Prenom}`}));
      console.log('sending email to ', to)
      for (const to1 of to) {
        try {
          strapi.plugins.email.services
            .email.sendTemplatedEmail(
            {
              to: to1.email,
              attachments: [
                alert.SourceFile[0]?.url ? {href: alert.SourceFile[0]?.url} : void 0,
                alert.SourceUrl ? {href: alert.SourceUrl} : void 0
              ].reduce((attachments, attach) => attach ? [...attachments, attach] : attachments, [])
            },
            {subject: etpl.subject, html: etpl.html, text: etpl.text},
            {alert}
          )

          console.log('mail sent to ', to1)
        } catch (ex) {
          console.log('email error ', ex)
        }
      }
    }
  }

}
;
