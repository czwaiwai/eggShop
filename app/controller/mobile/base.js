'use strict';
const Controller = require('egg').Controller;
class BaseController extends Controller {
  getUser() {
    const { user } = this.ctx.session;
    if (user) {
      return user;
    }
    this.ctx.throw(403, '你还没有登录');
  }
  async verify() {
    const captcha = await this.service.tools.captcha();
    this.ctx.response.type = 'image/svg+xml';
    this.ctx.body = captcha.data;
  }
  async upload() {
    const res = await this.service.tools.upload();
    this.succ(res);
  }
  // 通过spname 获取导航栏
  async treeByName(sp_name) {
    const cate = await this.ctx.model.Category.findOne({ sp_name });
    let reg = '';
    if (cate.parent === '0') {
      reg = new RegExp('^' + cate.path);
    } else {
      reg = new RegExp(',' + cate.path);
    }
    const res = await this.ctx.model.Category.find({ path: reg }).lean();
    const tree = this.ctx.service.tools.toTree(res, '0');
    return tree;
  }

  // 通过spname查找分组相关page页
  async groupByName(sp_name, type = 0) {
    const group = await this.ctx.model.PageGroup.findOne({ sp_name, type });
    const res = await this.ctx.model.Page.find({ group_id: group._id });
    return res;
  }
  async groupByBanner(sp_name, type = 1) {
    const group = await this.ctx.model.PageGroup.findOne({ sp_name, type });
    const res = await this.ctx.model.Banner.find({ group_id: group._id });
    return res;
  }
  async globData() {
    // 获取导航栏数据
    // const navbar = await this.treeByName('homebar');
    // 获取PC配置信息
    const website = await this.ctx.model.Dict.findOne({ sp_name: 'website', group_id: '' });
    // 获取页尾部信息
    // const footlinks = await this.treeByName('helper');
    // 获取友情链接
    // const friends = await this.groupByName('links');
    return {
      // navbar,
      website: website.value,
      // footlinks,
      // friends,
    };
  }
  // isOnly 表示仅仅输出data结果不合并全局数据
  async succ(data, isOnly = false) {
    let sendData = {};
    if (isOnly) {
      sendData = { ...data };
    } else {
      const { user } = this.ctx.session;
      const res = await this.globData();
      sendData = { ...res, ...data, user };
    }
    this.ctx.body = {
      code: '0',
      msg: '操作成功',
      data: sendData,
    };
  }
  fail(msg, code) {
    this.ctx.body = {
      code: code || '1',
      msg,
    };
  }
}
module.exports = BaseController;
