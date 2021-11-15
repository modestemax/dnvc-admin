'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async advancedSearch(ctx) {

    const where = ctx.query._where;
    if (where) {
      let select = `select n.*, m.Nom, uf.mime, uf.url
                    from notes_de_veilles n
                           left join notes_de_veilles__filieres nf on n.id = nf.notes_de_veille_id
                           left join filieres f on nf.filiere_id = f.id
                           left join notes_de_veilles__marches nm on n.id = nm.notes_de_veille_id
                           left join marches m on nm.march_id = m.id
                           left join themes_de_veilles tv on n.themes_de_veille = tv.id
                           left join upload_file_morph ufm on n.id = ufm.related_id
                           left join upload_file uf on ufm.upload_file_id = uf.id
      `

      const fquery = ("Filieres.Name" in where) ? ` f."Name" = '${where ["Filieres.Name"]}' or f."Name" is null` : 'true'

      const mquery = ("Marches.Nom" in where) ? ` m."Nom" = '${where ["Marches.Nom"]}' or m."Nom" is null` : 'true'

      const tquery = ("themes_de_veille.Nom" in where) ? ` tv."Nom" = '${where ["themes_de_veille.Nom"]}' or tv."Nom" is null` : 'true'

      const dgquery = ("DatePublication_gte" in where) ? `  ( '${where["DatePublication_gte"]}'  <="DatePublication")` : 'true'

      const dlquery = ("DatePublication_lte" in where) ? `  ( '${where["DatePublication_lte"]}'  >="DatePublication")` : 'true'

      const query = `${select} where (${fquery}) and (${mquery}) and (${tquery}) and (${dgquery}) and (${dlquery})`


      console.log('query is ', query)

      let notes = await strapi.connections.default.raw(query)

      notes = notes.rows

      const filteredNotes = []

      for (const item of notes) {
        if (item.mime !== null) {
          const image = notes.filter((note) => {
            return note.id === item.id && note.mime.split('/')[0] === 'image';
          })
          const doc = notes.filter((note) => {
            return note.id === item.id && note.mime.split('/')[0] !== 'image';
          })
          let markets = notes.filter((note) => {
            return note.id === item.id;
          })

          markets = [...new Map(markets.map(market =>
            [market['Nom'], market.Nom !== null ? { Nom: market.Nom } : void 0])).values()]; // Took somewhere on internet but customised

          if (!!image.length) {
            if (!!doc.length) {
              filteredNotes.push({...image[0], Marches: markets, SourceFile: [{url: doc[0].url}]})
            } else {
              filteredNotes.push({...image[0], Marches: markets, SourceFile: []})
            }
          } else {
            if (!!doc.length) {
              filteredNotes.push({...doc[0], Marches: markets, SourceFile: [{url: doc[0].url}]})
            }
          }
        } else {

          let markets = notes.filter((note) => {
            return note.id === item.id;
          })

          markets = [...new Map(markets.map(market =>
            [market['Nom'], market.Nom !== null ? { Nom: market.Nom } : void 0])).values()]; // Took somewhere on internet but customised

          filteredNotes.push({...item, Marches: markets, SourceFile: []})
        }

        notes = notes.filter((note) => {
          return note.id !== item.id
        })
      }

      console.debug(filteredNotes)

      return ctx.send(filteredNotes);

    }
    ctx.badRequest('set conditions')
  }

};
