'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    // async beforeCreate(data) {
    async beforeUpdate(params, data) {
      console.log(' SENDGRID_API_KEY ', process.env.SENDGRID_API_KEY);
      console.log(' date ', data);
      debugger
      await strapi.plugins.email.services.email.send({
        "personalizations": [{
          "to": [{
            "email": data.Email,
            "name": data.Nom
          }],
          "dynamic_template_data":{
            "email":data.Email,
          }
        }],
        "template_id": "d-e41972b1532a49d0be76167df96711b7",
      });

    },
  }
};
