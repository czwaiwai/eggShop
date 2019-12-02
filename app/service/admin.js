'use strict';
const url = require('url');
const Service = require('egg').Service;

class AdminService extends Service {
  async checkAuth(ignoreArr = [ '/admin/doLogin', '/admin/verify', '/admin/doLogout' ]) {
    const user = this.ctx.session.admin;
    console.log(user);
    if (user.is_super === 1) {
      return true;
    }
    const accessList = await this.ctx.model.RoleAccess.find({ role_id: user.role_id });
    const accessIds = accessList.map(item => item.access_id.toString());
    const pathname = url.parse(this.ctx.url).pathname;
    if (ignoreArr.includes(pathname)) {
      return true;
    }
    const access = await this.ctx.model.Access.find({ url: pathname });
    if (access && access.length > 0) {
      return accessIds.includes(access[0]._id.toString());
    }
    return false;
  }
  async getAuthList(role_id) {
    const allAuths = await this.ctx.model.Access.find({});
    if (this.ctx.session.admin.is_super === 1) {
      return allAuths;
    }
    const myAccess = await this.ctx.model.RoleAccess.find({ role_id });
    const accessArr = myAccess.map(item => item.access_id.toString());
    const res = allAuths.filter(item => {
      return accessArr.includes(item._id.toString());
    });
    return res;
  }
}

module.exports = AdminService;
