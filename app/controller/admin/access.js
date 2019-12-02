'use strict';
const BaseController = require('./base.js');
class AccessController extends BaseController {
  async index() {
    const res = await this.ctx.model.Access.aggregate([
      { $match: { module_id: '0' } },
      {
        $lookup: {
          from: 'access',
          localField: '_id',
          foreignField: 'module_id',
          as: 'children',
        },
      }]);
    this.succ({
      list: res,
    });
  }
  async doAdd() {
    const body = this.ctx.request.body;
    if (body.module_id !== '0') {
      body.module_id = this.app.mongoose.Types.ObjectId(body.module_id);
    }
    const access = new this.ctx.model.Access(body);
    access.save();
    this.succ();
  }
  async doEdit() {
    const { _id, ...other } = this.ctx.request.body;
    if (other.module_id !== '0') {
      other.module_id = this.app.mongoose.Types.ObjectId(other.module_id);
    }
    await this.ctx.model.Access.updateOne({ _id }, {
      ...other,
    });
    this.succ();
  }
  async detail() {
    const { _id } = this.ctx.request.query;
    let res;
    if (_id) {
      res = await this.ctx.model.Access.findById(_id);
    }
    const modules = await this.ctx.model.Access.find({ module_id: '0', status: 1 });
    this.succ({
      info: res,
      modules,
    });
  }
  async doDel() {
    const { _id } = this.ctx.request.body;
    await this.ctx.model.Access.deleteOne({ _id });
    this.succ();
  }
}

module.exports = AccessController;
