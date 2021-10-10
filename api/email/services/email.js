'use strict';

/**
 * `email` service.
 */

module.exports = {

  /*
    @param to : [{email,name}]
    @param dynamic_template_data : Object
    @param template_id : String
   */
  async send({to, dynamic_template_data, template_id}) {
    await strapi.plugins.email.services
      .email.send({"personalizations": [{to, dynamic_template_data}], template_id,});
  }

};
