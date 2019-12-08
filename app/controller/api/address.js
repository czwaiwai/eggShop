'use strict';

const BaseController = require('./base.js');
class AddressController extends BaseController {
  async index() {
    const { user } = this.ctx.session;
    const res = await this.ctx.model.Address.find({
      user_id: user._id,
    }).sort({ _id: -1 });
    await this.succ({
      list: res,
    });
  }
  async detail() {
    const { _id } = this.ctx.request.query;
    const res = await this.ctx.model.Address.findById(_id, { user_id: 0 });
    await this.succ({
      info: res,
    }, true);
  }
  async doAdd() {
    const { user } = this.ctx.session;
    const body = this.ctx.request.body;
    const params = { ...body };
    params.user_id = user._id;
    console.log(params);
    const address = new this.ctx.model.Address(params);
    await address.save();
    await this.succ({}, true);
  }
  async doEdit() {
    const { _id, ...other } = this.ctx.request.body;
    await this.ctx.model.Address.updateOne({ _id }, other);
    await this.succ({}, true);
  }
  async doDel() {
    const { _id } = this.ctx.request.body;
    await this.ctx.model.Address.deleteOne({ _id });
    await this.succ({}, true);
  }
}

module.exports = AddressController;
