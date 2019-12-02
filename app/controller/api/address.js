'use strict';

const BaseController = require('./base.js');
class AddressController extends BaseController {
  async index() {
    const { user } = this.ctx.session;
    const res = await this.ctx.model.Address.find({
      user_id: user._id,
    });
    this.succ({
      list: res,
    });
  }
  async detail() {
    const { _id } = this.ctx.request.query;
    const res = await this.ctx.model.Address.findById(_id, { user_id: -1 });
    this.succ({
      info: res,
    });
  }
  async doAdd() {
    const { user } = this.ctx.session;
    const body = this.ctx.request.body;
    const params = { ...body };
    params.user_id = this.app.mongoose.Schema.ObjectId(user._id);
    const address = new this.ctx.model.Address(body);
    await address.save();
    this.succ();
  }
  async doEdit() {
    const { _id, ...other } = this.ctx.request.body;
    await this.ctx.model.Address.updateOne({ _id }, other);
    this.succ();
  }
  async doDel() {
    const { _id } = this.ctx.request.body;
    await this.ctx.model.Address.deleteOne({ _id });
    this.succ();
  }
}

module.exports = AddressController;
