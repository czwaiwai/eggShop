'use strict';
const url = require('url');
const ignorePaths = [
  '/api/index',
  '/api/doLogin',
  '/api/home',
  '/api/product',
  '/api/productDetail',
  '/api/page',
  '/api/pageById',
  '/api/pageList',
  '/api/brand',
];
module.exports = () => {
  return async function indexAuth(ctx, next) {
    const pathname = url.parse(ctx.request.url).pathname;
    if (ctx.session.user) {
      await next();
    } else {
      if (ignorePaths.includes(pathname)) {
        await next();
      } else {
        ctx.throw(403, {
          code: '1',
          message: '用户登录已失效',
        });
      }
    }
  };
};
