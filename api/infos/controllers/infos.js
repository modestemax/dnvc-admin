'use strict';
const axios = require('axios');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async getFirstImg(ctx) {
    let select = `select uf."url" from infos i
       left join upload_file_morph ufm on i."id" = ufm."related_id"
       left join upload_file uf on ufm."upload_file_id" = uf."id"
       where ufm.related_type = 'infos' and ufm.field = 'home_picture1'`;

    let homePictureSRC = await strapi.connections.default.raw(select)

    homePictureSRC = homePictureSRC.rows[0].url

    return ctx.send(`<!DOCTYPE html>
      <html>
         <head>
            <meta http-equiv = "refresh" content = "0;url='${homePictureSRC}'"/>
         </head>
         <body>
         </body>
      </html>`)
  },

  async getSecondImg(ctx) {
    let select = `select uf."url" from infos i
       left join upload_file_morph ufm on i."id" = ufm."related_id"
       left join upload_file uf on ufm."upload_file_id" = uf."id"
       where ufm.related_type = 'infos' and ufm.field = 'home_picture2'`;

    let homePictureSRC = await strapi.connections.default.raw(select)

    homePictureSRC = homePictureSRC.rows[0].url

    return ctx.send(`<!DOCTYPE html>
      <html>
         <head>
            <meta http-equiv = "refresh" content = "0;url='${homePictureSRC}'"/>
         </head>
         <body>
         </body>
      </html>`)
  },

  async getLogoMincom(ctx) {
    let select = `select uf."url" from infos i
       left join upload_file_morph ufm on i."id" = ufm."related_id"
       left join upload_file uf on ufm."upload_file_id" = uf."id"
       where ufm.related_type = 'infos' and ufm.field = 'logo_mincommerce'`;

    let logo = await strapi.connections.default.raw(select)

    logo = logo.rows[0].url

    return ctx.send(`<!DOCTYPE html>
      <html>
         <head>
            <meta http-equiv = "refresh" content = "0;url='${logo}'"/>
         </head>
         <body>
         </body>
      </html>`)
  }
};
