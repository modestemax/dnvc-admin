'use strict';

/**
 * `has-at-least-one-criteria` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log('In has-at-least-one-criteria policy.');
  debugger
  const alerte = ctx.request.body
  if (!alerte?.criteres?.length) {
    return ctx.badRequest('please set at least one criterion')
  }
  await next();
};
