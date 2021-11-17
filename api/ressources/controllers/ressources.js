'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async advancedSearch(ctx) {

    const where = ctx.query._where;

    if (where) {

      let select = `select r."id", r."titre", r."resume", r."date", r."SourceUrl",
                    array_agg(m."Nom") as marche,
                    array_agg(uf."url") as files,
                    array_agg(f."Name") as filieres
                    from ressources r
                       left join ressources__filieres rf on r."id" = rf."ressource_id"
                       left join filieres f on rf."filiere_id" = f."id"
                       left join marches m on r."marche" = m."id"
                       left join themes_de_veilles tv on r."themes_de_veille" = tv."id"
                       left join upload_file_morph ufm on r."id" = ufm."related_id"
                       left join upload_file uf on ufm."upload_file_id" = uf."id"
    `

      const fquery = ("filieres.Name" in where) ? ` f."Name" = '${where ["filieres.Name"]}' or f."Name" is null` : 'true'

      const mquery = ("marche.Nom" in where) ? ` m."Nom" = '${where ["marche.Nom"]}' or m."Nom" is null` : 'true'

      const tquery = ("themes_de_veille.Nom" in where) ? ` tv."Nom" = '${where ["themes_de_veille.Nom"]}' or tv."Nom" is null` : 'true'

      const dgquery = ("date_gte" in where) ? `  ( '${where["date_gte"]}'  <="date")` : 'true'

      const dlquery = ("date_lte" in where) ? `  ( '${where["date_lte"]}'  >="date")` : 'true'

      const query = `${select} where (${fquery}) and (${mquery}) and (${tquery}) and (${dgquery}) and (${dlquery}) group by r.id`


      console.log('query is ', query)

      let ressources = await strapi.connections.default.raw(query)

      ressources = ressources.rows

      ressources.forEach((ressource) => {
        if (ressource.marche[0] !== null) {
          let tempMarketArray = ressource.marche.map(marche => ({ Nom: marche }))
          ressource.marche = [...new Map(tempMarketArray.map(market => [market['Nom'], { Nom: market.Nom }])).values()]
          ressource.marche = ressource.marche[0]
        } else {
          ressource.marche = []
        }

        if (ressource.filieres[0] !== null) {
          let tempSectorArray = ressource.filieres.map(filiere => ({ Name: filiere }))
          ressource.filieres = [...new Map(tempSectorArray.map(sector => [sector['Name'], { Name: sector.Name }])).values()]
        } else {
          ressource.filieres = []
        }

        if (ressource.files[0] !== null) {
          let tempFileArray = ressource.files.map(url => ({ url: url }))
          ressource.files = [...new Map(tempFileArray.map(file => [file['url'], { url: file.url }])).values()]
        } else {
          ressource.files = []
        }
      })

      return ctx.send(ressources);
    }
    ctx.badRequest('set conditions')
  }
};
