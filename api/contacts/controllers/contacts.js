'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async reduced(ctx) {

    let select = `select c."id", c."Email", c."Etat" from contacts c where c."Email" notnull`;

    let contacts = await strapi.connections.default.raw(select);

    contacts = contacts.rows;

    ctx.send(contacts);
  }
};
