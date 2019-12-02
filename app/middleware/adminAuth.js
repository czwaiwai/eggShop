'use strict';
const url = require('url');
const ignorePaths = [
  '/admin/doLogin',
  '/admin/verify',
  '/admin/doLogout',
];
module.exports = () => {
  return async function adminAuth(ctx, next) {
    const pathname = url.parse(ctx.request.url).pathname;
    if (ctx.session.admin) {
      if (await ctx.service.admin.checkAuth(ignorePaths)) {
        await next();
      } else {
        ctx.throw(403, {
          code: '403',
          message: '没有权限访问',
        });
      }
    } else {
      if (ignorePaths.includes(pathname)) {
        await next();
      } else {
        ctx.throw(403, {
          code: '403',
          message: '用户登录已失效',
        });
      }
    }
  };
};
