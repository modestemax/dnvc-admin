'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async advSearch(ctx) {

    const where = ctx.query._where;
    if (where) {
      let select = `select a."id", a."Title", a."Type", a."Resume", a."DatePublication", a."SourceUrl",
                    array_agg(m."Nom") as marches,
                    array_agg(uf."url") as files,
                    array_agg(sv."NomStructure") as emetteur
                    from alertes a
                           left join alertes__filieres af on a."id" = af."alerte_id"
                           left join filieres f on af."filiere_id" = f."id"
                           left join alertes__marches am on a."id" = am."alerte_id"
                           left join marches m on am."march_id" = m."id"
                           left join themes_de_veilles tv on a."themes_de_veille" = tv."id"
                           left join structure_de_veilles sv on a."Emetteur" = sv."id"
                           left join upload_file_morph ufm on a."id" = ufm."related_id"
                           left join upload_file uf on ufm."upload_file_id" = uf."id"
      `

      const fquery = ("Filieres.Name" in where) ? ` f."Name" = '${where ["Filieres.Name"]}' or f."Name" is null` : 'true'

      const mquery = ("Marches.Nom" in where) ? ` m."Nom" = '${where ["Marches.Nom"]}' or m."Nom" is null` : 'true'

      const tquery = ("themes_de_veille.Nom" in where) ? ` tv."Nom" = '${where ["themes_de_veille.Nom"]}' or tv."Nom" is null` : 'true'

      const dgquery = ("DatePublication_gte" in where) ? `  ( '${where["DatePublication_gte"]}'  <="DatePublication")` : 'true'

      const dlquery = ("DatePublication_lte" in where) ? `  ( '${where["DatePublication_lte"]}'  >="DatePublication")` : 'true'

      const query = `${select} where (${fquery}) and (${mquery}) and (${tquery}) and (${dgquery}) and (${dlquery}) group by a.id`


      console.log('query is ', query)

      let alertes = await strapi.connections.default.raw(query)

      alertes = alertes.rows

      alertes.forEach((alerte) => {
        if (alerte.marches[0] !== null) {
          let tempMarketArray = alerte.marches.map(marche => ({ Nom: marche }))
          alerte.marches = [...new Map(tempMarketArray.map(market => [market['Nom'], { Nom: market.Nom }])).values()]
        } else {
          alerte.marches = []
        }

        if (alerte.files[0] !== null) {
          let tempFileArray = alerte.files.map(url => ({ url: url }))
          alerte.files = [...new Map(tempFileArray.map(file => [file['url'], { url: file.url }])).values()]
          alerte.files.forEach((file) => {
            if (typeof file.url !== 'undefined')
              if (file.url.toLowerCase().includes('.jpg') || file.url.toLowerCase().includes('.jpeg')
                || file.url.toLowerCase().includes('.png') || file.url.toLowerCase().includes('.gif')) {
                alerte.files.splice(alerte.files.indexOf(file), 1);
              }
          });
        } else {
          alerte.files = []
        }

        let tempEmArray = alerte.emetteur.map(em => ({ NomStructure: em }))
        alerte.emetteur = [...new Map(tempEmArray.map(em => [em['NomStructure'], { NomStructure: em.NomStructure }])).values()]
      })

      return ctx.send(alertes);

    }
    ctx.badRequest('set conditions')
  }
}
