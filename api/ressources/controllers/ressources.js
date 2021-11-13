'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async advancedSearch(ctx) {

    const where = ctx.query._where;

    let select = `select r.*, uf.url
                            from ressources r
                            left join ressources__filieres rf on r.id = rf.ressource_id
                            left join filieres f on rf.filiere_id = f.id
                            left join ressources__marches rm on r.id = rm.ressource_id
                            left join marches m on rm.march_id = m.id
                            left join themes_de_veilles tv on r.themes_de_veille = tv.id
                            left join upload_file_morph ufm on r.id = ufm.related_id
                            left join upload_file uf on ufm.upload_file_id = uf.id
    `

    const fquery = ("Filieres.Name" in where) ? ` f."Name" = '${where ["Filieres.Name"]}' or f."Name" is null` : 'true'

    const mquery = ("Marches.Nom" in where) ? ` m."Nom" = '${where ["Marches.Nom"]}' or m."Nom" is null` : 'true'

    const tquery = ("themes_de_veille.Nom" in where) ? ` tv."Nom" = '${where ["themes_de_veille.Nom"]}' or tv."Nom" is null` : 'true'

    const dgquery = ("DatePublication_gte" in where) ? `  ( '${where["DatePublication_gte"]}'  <="DatePublication")` : 'true'

    const dlquery = ("DatePublication_lte" in where) ? `  ( '${where["DatePublication_lte"]}'  >="DatePublication")` : 'true'

    const query = `${select} where ${fquery} and ${mquery} and ${tquery} and ${dgquery} and ${dlquery}`


    console.log('query is ', query)

    let ressources = await strapi.connections.default.raw(query)

    ressources.forEach((ressource) => {
      ressource.sourceFile = [ {"url": ressource.url} ]
      delete ressource.url
    })

    console.debug(ressources)

    ctx.send(ressources);

  }

};
