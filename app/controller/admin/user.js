'use strict';

const BaseController = require('./base');
class UserController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.modelName = 'User';
  }
  async index() {
    let { page, pageSize } = this.ctx.request.query;
    page = parseInt(page || 1);
    pageSize = parseInt(pageSize || 10);
    const total = await this.ctx.model[this.modelName].count({});
    const res = await this.ctx.model[this.modelName].find({}, { pwd: 0 }).skip((page - 1) * +pageSize).limit(+pageSize);
    this.succ({
      list: res,
      page,
      pageSize,
      total,
    });
  }
}

module.exports = UserController;
