'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async advSearch(ctx) {
    const where = ctx.query._where;

    let query = `select  a.*
                 from alertes a
                        left join alertes__filieres af on a.id = af.alerte_id
                        left join filieres f on af.filiere_id = f.id
                        left join alertes__marches am on a.id = am.alerte_id
                        left join marches m on am.march_id = m.id
                        left join themes_de_veilles tv on a.themes_de_veille = tv.id

                 where (${"Filieres.Name" in where ?'f."Name" = \'' +where ["Filieres.Name"] +'\' or':''} f."Name" is null)
                   and (${"Marches.Nom" in where ?'m."Nom" = \''+ where ["Marches.Nom"]+ '\' or':''} m."Nom" is null)
                   and (${"themes_de_veille.Nom" in where ?'tv."Nom" = \''+ where ["themes_de_veille.Nom"] +'\' or':''} tv."Nom" is null)
    `
    if ("DatePublication_gte" in where)
      query += ` and ( '${where["DatePublication_gte"]}'  <="DatePublication")`

    if ("DatePublication_lte" in where)
      query += ` and ( '${where["DatePublication_lte"]}'  >="DatePublication")`

    let alertes = await strapi.connections.default.raw(query)
    ctx.send(alertes);

  }
};
