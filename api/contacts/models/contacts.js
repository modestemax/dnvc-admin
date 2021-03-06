'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
const {randomUUID} = require('crypto'); // Added in: node v14.17.0
const uuid = require('uuid');

module.exports = {
  lifecycles: {
    async beforeUpdate(params, data) {    },
    async afterUpdate(params, data) {    },
    beforeCreate(data) {
      data.activation_code = uuid()
    },
    async afterCreate(result, data) {
      console.log(' date ', data);
     //debugger
      strapi.services.contacts.sendActivationRequest({
        "to": data.Email,
        data
      });
    },
    async afterCreate_sendgrid(result, data) {
      console.log(' SENDGRID_API_KEY ', process.env.SENDGRID_API_KEY);
      console.log(' date ', data);
      debugger
      strapi.services.contacts.sendActivationRequest({
        "to": [{
          "email": data.Email,
          "name": data.Nom
        }],
        "dynamic_template_data": {
          "email": data.Email,
          "activation_code": data.activation_code,
        }
      });
    },
  }
};
