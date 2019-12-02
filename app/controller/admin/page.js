'use strict';

const BaseController = require('./base.js');
class PageController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.modelName = 'Page';
  }
  async index() {
    let { group_id } = this.ctx.request.query;
    if (group_id) {
      const mongoose = this.app.mongoose;
      group_id = mongoose.Types.ObjectId(group_id);
    } else {
      group_id = '';
    }
    const params = { group_id: group_id || '' };
    const res = await this.ctx.model[this.modelName].find(params);
    this.succ({
      list: res,
    });
  }
  async doAdd() {
    const body = this.ctx.request.body;
    const mongoose = this.app.mongoose;
    if (body.group_id) {
      body.group_id = mongoose.Types.ObjectId(body.group_id);
    }
    const instance = new this.ctx.model[this.modelName](body);
    await instance.save();
    this.succ();
  }
  async doEdit() {
    const { _id, ...params } = this.ctx.request.body;
    const mongoose = this.app.mongoose;
    if (params.group_id) {
      params.group_id = mongoose.Types.ObjectId(params.group_id);
    }
    await this.ctx.model[this.modelName].updateOne({ _id }, params);
    this.succ();
  }
  async doGroupAdd() {
    const body = await this.ctx.request.body;
    const pageGroup = new this.ctx.model.PageGroup(body);
    await pageGroup.save();
    this.succ();
  }
  async groupIndex() {
    const res = await this.ctx.model.PageGroup.find({});
    this.succ({
      list: res,
    });
  }
}

module.exports = PageController;
