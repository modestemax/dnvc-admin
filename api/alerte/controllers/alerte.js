'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async advSearch(ctx) {

    const where = ctx.query._where;
    if (where) {
      let select = `select a.*, m.Nom, uf.mime, uf.url
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

      const query = `${select} where (${fquery}) and (${mquery}) and (${tquery}) and (${dgquery}) and (${dlquery})`


      console.log('query is ', query)

      let alertes = await strapi.connections.default.raw(query)

      alertes = alertes.rows

      const filteredAlerts = []

      for (const item of alertes) {
        if (item.mime !== null) {
          const image = alertes.filter((alerte) => {
            return alerte.id === item.id && alerte.mime.split('/')[0] === 'image';
          })
          const doc = alertes.filter((alerte) => {
            return alerte.id === item.id && alerte.mime.split('/')[0] !== 'image';
          })
          let markets = alertes.filter((alerte) => {
            return alerte.id === item.id;
          })

          markets = [...new Map(markets.map(market =>
            [market['Nom'], market.Nom !== null ? { Nom: market.Nom } : void 0])).values()]; // Took somewhere on internet but customised

          if (!!image.length) {
            if (!!doc.length) {
              filteredAlerts.push({...image[0], Marches: markets, SourceFile: [{url: doc[0].url}]})
            } else {
              filteredAlerts.push({...image[0], Marches: markets, SourceFile: []})
            }
          } else {
            if (!!doc.length) {
              filteredAlerts.push({...doc[0], Marches: markets, SourceFile: [{url: doc[0].url}]})
            }
          }
        } else {

          let markets = alertes.filter((alerte) => {
            return alerte.id === item.id;
          })

          markets = [...new Map(markets.map(market =>
            [market['Nom'], market.Nom !== null ? { Nom: market.Nom } : void 0])).values()]; // Took somewhere on internet but customised

          filteredAlerts.push({...item, Marches: markets, SourceFile: []})
        }

        alertes = alertes.filter((alerte) => {
          return alerte.id !== item.id
        })
      }

      console.debug(filteredAlerts)

      return ctx.send(filteredAlerts);

    }
    ctx.badRequest('set conditions')
  }
};
