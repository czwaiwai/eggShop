'use strict';
const BaseController = require('./base.js');
class RoleController extends BaseController {
  async index() {
    const res = await this.ctx.model.Role.find({});
    this.succ({
      list: res || [],
    });
  }
  async detail() {
    const { _id } = this.ctx.request.query;
    const res = await this.ctx.model.Role.findById(_id);
    this.succ({
      info: res,
    });
  }
  async auth() {
    const { role_id } = this.ctx.request.query;
    const allAuths = await this.ctx.model.Access.aggregate([
      { $match: { module_id: '0' } },
      {
        $lookup: {
          from: 'access',
          localField: '_id',
          foreignField: 'module_id',
          as: 'children',
        },
      }]);
    const myAccess = await this.ctx.model.RoleAccess.find({ role_id });
    const accessArr = myAccess.map(item => item.access_id.toString());
    const res = allAuths.map(item => {
      item.checked = accessArr.includes(item._id.toString());
      item.children = item.children.map(sub => {
        sub.checked = accessArr.includes(sub._id.toString());
        return sub;
      });
      return item;
    });
    this.succ({
      list: res,
    });
  }
  async doAuth() {
    const { access_ids, role_id } = this.ctx.request.body;
    // 首先删除之前绑定的权限
    await this.ctx.model.RoleAccess.deleteMany({ role_id });
    const arr = access_ids.split(',');
    const { mongoose } = this.app;
    if (arr && arr.length) {
      for (let i = 0; i < arr.length; i++) {
        const roleAccess = new this.ctx.model.RoleAccess({
          role_id: mongoose.Types.ObjectId(role_id),
          access_id: mongoose.Types.ObjectId(arr[i]),
        });
        await roleAccess.save();
      }
    }
    this.succ();
  }
  // 展示授权信息
  async roleAccess() {
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
    const role = new this.ctx.model.Role(body);
    await role.save();
    this.succ();
  }
  async doEdit() {
    const { _id, title, description, status } = this.ctx.request.body;
    await this.ctx.model.Role.updateOne({ _id }, { title, description, status });
    this.succ();
  }
  async doDel() {
    const { _id } = this.ctx.request.body;
    await this.ctx.model.Role.deleteOne({ _id });
    this.succ();
  }
}

module.exports = RoleController;
