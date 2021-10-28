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
          if (alert.SourceUrl) {
            //FR: Ouvrir le document source
            // EN: View full details
            alert.sourceUrlTag = `<a href="${alert.SourceUrl}">View full details / Ouvrir le document source</a>`
            alert.html += `<br/><%=alert.sourceUrlTag%>`
          }

          strapi.plugins.email.services
            .email.sendTemplatedEmail(
            {
              to: to1.email,
              attachments: alert.SourceFile[0]?.url ? [{href: alert.SourceFile[0]?.url}] : []
              // .reduce((attachments, attach) => attach ? [...attachments, attach] : attachments, [])
            },
            {subject: alert.Title, html: etpl.html, text: etpl.text},
            {alert}
          )

          console.log('mail sent to ', to1)
        } catch (ex) {
          console.log('email error ', ex)
        }
      }
    }
  },

  checkMandatoryField(data) {
    console.log('checkMandatoryField on ',arguments)
    const {Marches, Filieres, themes_de_veille, Emetteur} = data
    if (!Marches?.length && !Filieres?.length && !themes_de_veille)
      throw strapi.errors.badRequest('Bien vouloir renseigner aumoins un marché/Filiere/theme de veille');
    if (!Emetteur)
      throw strapi.errors.badRequest('Bien vouloir renseigner la STRUCTURE DE VEILLE');
  }
}

