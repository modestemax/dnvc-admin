/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      console.log('before create notes ', arguments)
      if (!data.Emetteur) {
        throw strapi.errors.badRequest('Bien vouloir renseigner la STRUCTURE DE VEILLE');
      }
      // Check if there is sectors, markets or monitoring theme
      data.hasFilieres = !!data.Filieres?.length
      data.hasMarches = !!data.Marches?.length
      data.hasTheme = !!data.themes_de_veille;
    },
    async beforeUpdate({id}, data) {
      console.log('before update notes ', arguments)
      if (!(Object.keys(data).length === 1 && 'published_at' in data))
        if (!data.Emetteur) {
          throw strapi.errors.badRequest('Bien vouloir renseigner la STRUCTURE DE VEILLE');
        }
      // Check if there is sectors, markets or monitoring theme
      data.hasFilieres = !!data.Filieres?.length
      data.hasMarches = !!data.Marches?.length
      data.hasTheme = !!data.themes_de_veille;
    },
  }
};
