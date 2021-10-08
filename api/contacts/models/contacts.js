'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
const { isDraft } = require('strapi-utils').contentTypes;

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
    // async beforeUpdate(params, data) {
      console.log(' SENDGRID_API_KEY ', process.env.SENDGRID_API_KEY);
      console.log(' date ', data);
      debugger
      strapi.services.activation.send( {
          "to": [{
            "email": data.Email,
            "name": data.Nom
          }],
          "dynamic_template_data":{
            "email":data.Email,
          }
      });
    },
  }
};
