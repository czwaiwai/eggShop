'use strict';

const Controller = require('egg').Controller;
class BaseController extends Controller {
  async verify() {
    const captcha = await this.service.tools.captcha();
    this.ctx.response.type = 'image/svg+xml';
    this.ctx.body = captcha.data;
  }
  succ(data) {
    this.ctx.body = {
      code: '0',
      msg: '操作成功',
      data,
    };
  }
  fail(msg, code) {
    this.ctx.body = {
      code: code || '1',
      msg,
    };
  }
  async upload() {
    const res = await this.service.tools.upload();
    this.succ(res);
  }

  async index() {
    const res = await this.ctx.model[this.modelName].find({});
    this.succ({
      list: res,
    });
  }
  async detail() {
    const { _id } = this.ctx.request.query;
    const info = await this.ctx.model[this.modelName].findById(_id);
    this.succ({
      info,
    });
  }
  async doAdd() {
    const body = this.ctx.request.body;
    const instance = new this.ctx.model[this.modelName](body);
    await instance.save();
    this.succ();
  }
  async doEdit() {
    const { _id, ...params } = this.ctx.request.body;
    await this.ctx.model[this.modelName].updateOne({ _id }, params);
    this.succ();
  }
  async doDel() {
    const { _id } = this.ctx.request.body;
    await this.ctx.model[this.modelName].deleteOne({ _id });
    this.succ();
  }
}

module.exports = BaseController;
