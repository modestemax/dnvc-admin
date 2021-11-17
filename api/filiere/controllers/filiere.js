'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async reduced(ctx) {

    let query = `select f."id", f."Name" from filieres f order by f."Name" asc`

    let filieres = await strapi.connections.default.raw(query)

    filieres = filieres.rows

    return ctx.send(filieres)

  }

};
