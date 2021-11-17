'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async advancedSearch(ctx) {

    const where = ctx.query._where;
    if (where) {
      let select = `select n."id", n."Title", n."Type", n."Resume", n."DatePublication", n."SourceUrl",
                    array_agg(m."Nom") as marches,
                    array_agg(uf."url") as files,
                    array_agg(sv."NomStructure") as emetteur
                    from notes_de_veilles n
                           left join notes_de_veilles__filieres nf on n."id" = nf."notes_de_veille_id"
                           left join filieres f on nf."filiere_id" = f."id"
                           left join notes_de_veilles__marches nm on n."id" = nm."notes_de_veille_id"
                           left join marches m on nm."march_id" = m."id"
                           left join themes_de_veilles tv on n."themes_de_veille" = tv."id"
                           left join structure_de_veilles sv on n."Emetteur" = sv."id"
                           left join upload_file_morph ufm on n."id" = ufm."related_id"
                           left join upload_file uf on ufm."upload_file_id" = uf."id"
      `

      const fquery = ("Filieres.Name" in where) ? ` f."Name" = '${where ["Filieres.Name"]}' or f."Name" is null` : 'true'

      const mquery = ("Marches.Nom" in where) ? ` m."Nom" = '${where ["Marches.Nom"]}' or m."Nom" is null` : 'true'

      const tquery = ("themes_de_veille.Nom" in where) ? ` tv."Nom" = '${where ["themes_de_veille.Nom"]}' or tv."Nom" is null` : 'true'

      const dgquery = ("DatePublication_gte" in where) ? `  ( '${where["DatePublication_gte"]}'  <="DatePublication")` : 'true'

      const dlquery = ("DatePublication_lte" in where) ? `  ( '${where["DatePublication_lte"]}'  >="DatePublication")` : 'true'

      const query = `${select} where (${fquery}) and (${mquery}) and (${tquery}) and (${dgquery}) and (${dlquery}) group by n.id`


      console.log('query is ', query)

      let notes = await strapi.connections.default.raw(query)

      notes = notes.rows

      notes.forEach((note) => {
        if (note.marches[0] !== null) {
          let tempMarketArray = note.marches.map(marche => ({ Nom: marche }))
          note.marches = [...new Map(tempMarketArray.map(market => [market['Nom'], { Nom: market.Nom }])).values()]
        } else {
          note.marches = []
        }

        if (note.files[0] !== null) {
          let tempFileArray = note.files.map(url => ({ url: url }))
          note.files = [...new Map(tempFileArray.map(file => [file['url'], { url: file.url }])).values()]
        } else {
          note.files = []
        }

        let tempEmArray = note.emetteur.map(em => ({ NomStructure: em }))
        note.emetteur = [...new Map(tempEmArray.map(em => [em['NomStructure'], { NomStructure: em.NomStructure }])).values()]
      })

      return ctx.send(notes);

    }
    ctx.badRequest('set conditions')
  }

};
