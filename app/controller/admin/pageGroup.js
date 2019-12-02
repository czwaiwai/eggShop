'use strict';

const BaseController = require('./base');
class PageGroupController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.modelName = 'PageGroup';
  }
  async index() {
    const { type } = this.ctx.request.query;
    const res = await this.ctx.model[this.modelName].find({ type });
    this.succ({
      list: res,
    });
  }
}

module.exports = PageGroupController;
