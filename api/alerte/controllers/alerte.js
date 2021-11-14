'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async advSearch(ctx) {

    const where = ctx.query._where;
    if (where) {
      let select = `select a.*, uf.mime, uf.url
                    from alertes a
                           left join alertes__filieres af on a.id = af.alerte_id
                           left join filieres f on af.filiere_id = f.id
                           left join alertes__marches am on a.id = am.alerte_id
                           left join marches m on am.march_id = m.id
                           left join themes_de_veilles tv on a.themes_de_veille = tv.id
                           left join upload_file_morph ufm on a.id = ufm.related_id
                           left join upload_file uf on ufm.upload_file_id = uf.id
      `

      const fquery = ("Filieres.Name" in where) ? ` f."Name" = '${where ["Filieres.Name"]}' or f."Name" is null` : 'true'

      const mquery = ("Marches.Nom" in where) ? ` m."Nom" = '${where ["Marches.Nom"]}' or m."Nom" is null` : 'true'

      const tquery = ("themes_de_veille.Nom" in where) ? ` tv."Nom" = '${where ["themes_de_veille.Nom"]}' or tv."Nom" is null` : 'true'

      const dgquery = ("DatePublication_gte" in where) ? `  ( '${where["DatePublication_gte"]}'  <="DatePublication")` : 'true'

      const dlquery = ("DatePublication_lte" in where) ? `  ( '${where["DatePublication_lte"]}'  >="DatePublication")` : 'true'

      const query = `${select} where ${fquery} and ${mquery} and ${tquery} and ${dgquery} and ${dlquery}`


      console.log('query is ', query)

      let alertes = await strapi.connections.default.raw(query)

      alertes = alertes.rows

      alertes = alertes.map(alerte => ((alerte.mime !== null && alerte.mime.split('/')[0] !== 'image') ? {...alerte, SourceFile: [{"url": alerte.url}], url: void 0} : {...alerte, photo: {"url": alerte.url}, url: void 0, SourceFile: []}))

      alertes.forEach((item) => {
        const existing = alertes.filter((alerte) => {
          return alerte.id === item.id;
        })
        if (existing.length > 1) {
          if (existing[0].mime.split('/')[0] !== 'image')
            alertes.splice(alertes.indexOf(existing[1]), 1)
          else
            alertes.splice(alertes.indexOf(existing[0]), 1)
        }
      });

      console.debug(alertes)

      return ctx.send(alertes);
    }
    ctx.badRequest('set conditions')
  }
};
