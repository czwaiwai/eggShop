'use strict';

const BaseController = require('./base.js');
class BannerController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.modelName = 'Banner';
  }
  async index() {
    let { page, pageSize, group_id } = this.ctx.request.query;
    page = parseInt(page || 1);
    pageSize = parseInt(pageSize || 20);
    const params = {};
    if (group_id) {
      params.group_id = this.app.mongoose.Types.ObjectId(group_id);
    }
    const total = await this.ctx.model.Banner.count(params);
    const res = await this.ctx.model.Banner.find(params).skip((page - 1) * +pageSize).limit(+pageSize);
    this.succ({
      list: res,
      page,
      pageSize,
      total,
    });
  }
}

module.exports = BannerController;
