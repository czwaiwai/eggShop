'use strict';
const baseController = require('./base.js');
const md5 = require('md5');
class ManagerController extends baseController {
  // 管理员列表
  async index() {
    // const res = await this.ctx.model.Admin.find({ is_super: 0 });
    const res = await this.ctx.model.Admin.aggregate([
      { $match: { is_super: 0 } },
      { $project: { password: 0, is_super: 0 } },
      {
        $lookup: {
          from: 'role',
          localField: 'role_id',
          foreignField: '_id',
          as: 'role',
        },
      }]);
    this.succ({
      list: res,
    });
  }
  async detail() {
    const { id } = this.ctx.request.query;
    const res = await this.ctx.model.Admin.findById(id, { password: 0, is_super: 0 });
    const roles = await this.ctx.model.Role.find({ status: 1 });
    this.succ({
      info: res,
      roles,
    });
  }
  async add() {
    const res = await this.ctx.model.Role.find({ status: 1 });
    this.succ({
      roles: res,
    });
  }
  async doAdd() {
    const body = this.ctx.request.body;
    if (body.is_super) { // 不允许设置is_spuer字段
      this.ctx.throw('500', { code: '500', message: '没有设置权限' });
    }
    body.password = md5(body.password);
    const admin = new this.ctx.model.Admin(body);
    await admin.save();
    this.succ();
  }
  async doEdit() {
    const body = this.ctx.request.body;
    if (body.is_super) { // 不允许设置is_spuer字段
      this.ctx.throw('500', { code: '500', message: '没有设置权限' });
    }
    const { _id, username, password, status, email, role_id } = body;
    if (password) {
      const pwdMd5 = md5(password);
      await this.ctx.model.Admin.updateOne({ _id }, {
        username, password: pwdMd5, status, email, role_id,
      });
    } else {
      await this.ctx.model.Admin.updateOne({ _id }, {
        username, status, email, role_id,
      });
    }
    this.succ();
  }
  async doDel() {
    const { _id } = this.ctx.request.body;
    await this.ctx.model.Admin.deleteOne({ _id });
    this.succ();
  }
}

module.exports = ManagerController;
