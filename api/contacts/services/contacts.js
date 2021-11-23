'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async sendActivationRequest_sendgrid({to, dynamic_template_data}) {

    await strapi.services.email.send({
      to, dynamic_template_data,
      template_id: process.env.CONTACT_ACTIVATION_REQUEST_EMAIL_TEMPLATE_ID,
    });

  },
  async sendActivationRequest({to, data}) {
    try {
      debugger
      let etpl = await strapi.services['email-template'].getByApiName('activation_request')
      if (etpl) {
        etpl = etpl.toJSON()
        console.log('sending email to ', to)

        await strapi.plugins.email.services
          .email.sendTemplatedEmail(
            {to},
            {subject: etpl.subject, html: etpl.html, text: etpl.text},
            {activation_url: `${process.env.ACTIVATION_URL}/${data.activation_code}`}
          )

        console.log('mail sent to ', to)
      }
    } catch (ex) {
      console.log('email error ', ex)
    }
  }
};
