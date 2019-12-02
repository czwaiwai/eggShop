'use strict';
const md5 = require('md5');
const BaseController = require('./base.js');
class LoginController extends BaseController {
  async doLogin() {
    const body = this.ctx.request.body;
    this.ctx.validate({
      username: { type: 'string' },
      password: { type: 'string' },
      captcha: { type: 'string' },
    }, body);
    const { imgCode } = this.ctx.session;
    console.log(imgCode, body.captcha);
    if (imgCode.toUpperCase() !== body.captcha.toUpperCase()) {
      return this.fail('验证码不正确');
    }
    let { username, password } = body;
    password = md5(body.password);
    const user = await this.ctx.model.Admin.findOne({ username, password }, { password: 0 });
    console.log('找到的用户', user);
    if (!user) return this.fail('用户名或密码错误');
    this.ctx.session.admin = user;
    const auths = await this.ctx.service.admin.getAuthList(user.role_id);
    console.log('auths', JSON.stringify(auths));
    this.succ({
      user,
      auths,
    });
  }
  async getAuthList() {
    const user = this.ctx.session.admin;
    const auths = await this.ctx.service.admin.getAuthList(user.role_id);
    this.succ({
      auths,
    });
  }
  async doLogout() {
    this.ctx.session.admin = null;
    this.succ();
  }
}

module.exports = LoginController;
