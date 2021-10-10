'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
const {isDraft} = require('strapi-utils').contentTypes;

module.exports = {
  lifecycles: {
    async afterCreate(result, data) {
      console.log(result, data)
      debugger
    },
    async afterUpdate(data) {
      console.log(data)
      debugger
      if (!isDraft(data, strapi.models.alerte)) {
        let {Marches, Filieres, themes_de_veille} = data
        Marches = !Marches.length ? [null] : Marches.map(m => m.id)
        Filieres = !Filieres.length ? [null] : Filieres.map(m => m.id)
        themes_de_veille = !themes_de_veille ? null : themes_de_veille.id
        let conditions = []
        Marches.forEach(m => Filieres.forEach(f => {
          let cond = []
          if (m) cond.push('m.march_id=' + m)
          if (f) cond.push('f.filiere_id=' + f)
          if (themes_de_veille) cond.push('t."themes-de-veille_id"=' + f)
          conditions.push('(' + cond.join(' AND ') + ')')
        }))

        let query = `
          SELECT c.*, cc.contact_id, f.alert_criterion_id, f.filiere_id, m.march_id, t."themes-de-veille_id"
          FROM alert_criteria__filieres f
                 left JOIN alert_criteria__marches m on m.alert_criterion_id = f.alert_criterion_id
                 left JOIN alert_criteria__themes_de_veilles t on t.alert_criterion_id = m.alert_criterion_id
                 JOIN contacts_components cc on m.alert_criterion_id = cc.component_id
                 join contacts c on c.id = cc.contact_id
          WHERE ${conditions.join(' OR ')}
        `
        let contacts = await strapi.connections.default.raw(query)

        strapi.services.alerte.publish(data, contacts);

      }
    }
  }
};
