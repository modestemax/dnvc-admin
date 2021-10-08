'use strict';

/**
 * `activation` service.
 */

module.exports = {
  // exampleService: (arg1, arg2) => {
  //   return isUserOnline(arg1, arg2);
  // }
  async send({to, dynamic_template_data}) {

    await strapi.plugins.email.services.email.send({
      "personalizations": [{
        to, dynamic_template_data
      }],
      "template_id": "d-e41972b1532a49d0be76167df96711b7",
    });

  }

};
