'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async reduced(ctx) {
    const where = ctx.query._where
    if (where) {
      let query = `select m.id, m.Nom from marches m order by m.Nom asc`

      let marches = await strapi.connections.default.raw(query)

      marches = marches.rows

      return ctx.send(marches)
    }
  }

};
