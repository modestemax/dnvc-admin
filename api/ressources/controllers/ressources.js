'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async advancedSearch(ctx) {

    const where = ctx.query._where;

    if (where) {

      let select = `select r.*, m.Nom, uf.mime, uf.url
                    from ressources r
                       left join ressources__filieres rf on r.id = rf.ressource_id
                       left join filieres f on rf.filiere_id = f.id
                       left join marches m on r.marche = m.id
                       left join themes_de_veilles tv on r.themes_de_veille = tv.id
                       left join upload_file_morph ufm on r.id = ufm.related_id
                       left join upload_file uf on ufm.upload_file_id = uf.id
    `

      const fquery = ("filieres.Name" in where) ? ` f."Name" = '${where ["filieres.Name"]}' or f."Name" is null` : 'true'

      const mquery = ("marche.Nom" in where) ? ` m."Nom" = '${where ["marche.Nom"]}' or m."Nom" is null` : 'true'

      const tquery = ("themes_de_veille.Nom" in where) ? ` tv."Nom" = '${where ["themes_de_veille.Nom"]}' or tv."Nom" is null` : 'true'

      const dgquery = ("date_gte" in where) ? `  ( '${where["date_gte"]}'  <="date")` : 'true'

      const dlquery = ("date_lte" in where) ? `  ( '${where["date_lte"]}'  >="date")` : 'true'

      const query = `${select} where (${fquery}) and (${mquery}) and (${tquery}) and (${dgquery}) and (${dlquery})`


      console.log('query is ', query)

      let ressources = await strapi.connections.default.raw(query)

      ressources = ressources.rows

      // for (const item of ressources) {
      //   if (item.mime !== null) {
      //     const image = ressources.filter((ressource) => {
      //       return ressource.id === item.id && ressource.mime.split('/')[0] === 'image';
      //     })
      //     const doc = ressources.filter((ressource) => {
      //       return ressource.id === item.id && ressource.mime.split('/')[0] !== 'image';
      //     })
      //     let markets = ressources.filter((ressource) => {
      //       return ressource.id === item.id;
      //     })
      //
      //     markets = [...new Map(markets.map(market =>
      //       [market['Nom'], market.Nom !== null ? { Nom: market.Nom } : void 0])).values()]; // Took somewhere on internet but customised
      //
      //     if (markets[0] === undefined)
      //       markets = [null]
      //
      //     if (image.length !== 0) {
      //       if (doc.length !== 0) {
      //         filteredRessources.push({...image[0], marche: markets[0], photo: { url: image[0].url }, SourceFile: [{url: doc[0].url}]})
      //       } else {
      //         filteredRessources.push({...image[0], marche: markets[0], photo: { url: image[0].url }, SourceFile: []})
      //       }
      //     } else {
      //       if (doc.length !== 0) {
      //         filteredRessources.push({...doc[0], marche: markets[0], SourceFile: [{url: doc[0].url}]})
      //       }
      //     }
      //   } else {
      //
      //     let markets = ressources.filter((ressource) => {
      //       return ressource.id === item.id;
      //     })
      //
      //     markets = [...new Map(markets.map(market =>
      //       [market['Nom'], market.Nom !== null ? { Nom: market.Nom } : void 0])).values()]; // Took somewhere on internet but customised
      //
      //     console.log(markets)
      //
      //     filteredRessources.push({...item, marche: markets[0], photo: { url: item.url }, SourceFile: []})
      //   }
      //
      //   ressources = ressources.filter((ressource) => {
      //     return ressource.id !== item.id
      //   })
      // }

      return ctx.send(ressources);
    }
    ctx.badRequest('set conditions')
  }
};
