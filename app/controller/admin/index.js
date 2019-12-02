'use strict';
const BaseController = require('./base.js');
const md5 = require('md5');
class IndexController extends BaseController {
  // 后台首页
  async index() {
    const admin = new this.ctx.model.Admin({
      username: 'admin',
      password: md5('123456'),
      mobile: '13728905705',
      email: '278178596@qq.com',
      is_super: '1',
    });
    admin.save();
    this.succ();
  }
}

module.exports = IndexController;
