'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
const {isDraft} = require('strapi-utils').contentTypes;

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      console.log('before create alerte ', arguments)
      strapi.services.alerte.checkMandatoryField(data)
    },
    async beforeUpdate({id}, data) {
      console.log('before update alerte ', arguments)
      if (!(Object.keys(data).length === 1 && 'published_at' in data))
        strapi.services.alerte.checkMandatoryField(data)
    },

    async afterUpdate(data) {
      console.log('alert', data)
      debugger
      if (!isDraft(data, strapi.models.alerte)) {
        const {Marches, Filieres, themes_de_veille} = data
        const marcheIds = !Marches.length ? [null] : Marches.map(m => m.id)
        const filiereIds = !Filieres.length ? [null] : Filieres.map(m => m.id)
        const themeId = !themes_de_veille ? null : themes_de_veille.id
        const conditions = []
        marcheIds.forEach(march_id => filiereIds.forEach(filiere_id => {
          let cond = []
          march_id ? cond.push('(m.id=' + march_id + ' OR m.id is null)') : cond.push('true')// cond.push('m.id is null')
          filiere_id ? cond.push('(f.id=' + filiere_id + ' OR f.id is null)') : cond.push('true')//cond.push('f.id is null ')
          themeId ? cond.push('(t.id=' + themeId + ' OR t.id is null)') : cond.push('true')// cond.push('t.id is null')
          if (march_id || filiere_id || themeId)
            conditions.push('(' + cond.join(' AND ') + ')')
        }))

        let query = `
          SELECT cc.contact_id,
                 c.*,
                 acf.filiere_id,
                 f."Name" filiere_nom,
                 acm.march_id,
                 m."Nom"  marche_nom,
                 act."themes-de-veille_id",
                 t."Nom"  theme_nom
          FROM contacts_components cc
                 left join alert_criteria__filieres acf on cc.component_id = acf.alert_criterion_id
                 left join filieres f on acf.filiere_id = f.id
                 left join alert_criteria__marches acm on cc.component_id = acm.alert_criterion_id
                 left join marches m on acm.march_id = m.id
                 left join alert_criteria__themes act on cc.component_id = act.alert_criterion_id
                 left join themes_de_veilles t on act."themes-de-veille_id" = t.id
                 inner join contacts c on c.id = cc.contact_id

          WHERE ${conditions.join(' OR ') || 'true'}
          order by cc.contact_id
        `
        console.log('query = ', query)
        let contacts = await strapi.connections.default.raw(query)
        contacts = contacts.rows || contacts
        console.log('contacts = ', contacts)
        contacts.length && strapi.services.alerte.publish(data, contacts);
      }
    },
  }
};
