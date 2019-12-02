'use strict';

const BaseController = require('./base.js');
class DictController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.modelName = 'Dict';
  }
  async index() {
    const { group_id } = this.ctx.request.query;
    const params = {};
    if (group_id) {
      params.group_id = group_id;
    }
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
  async groupList() {
    const res = await this.ctx.model.Dict.findOne({ sp_name: 'dict_group' });
    this.succ({
      list: res.value || [],
    });
  }
  async doGroupAdd() {
    const { name, sp_name, remark } = this.ctx.request.body;
    const res = await this.ctx.model.Dict.findOne({ sp_name: 'dict_group' });
    if (!res) { // 不存在重新创建dict_group字典对象
      const group = { name, sp_name, remark };
      const dict = new this.ctx.model.Dict({
        name: '字典分组',
        sp_name: 'dict_group',
        group_name: '',
        sp_group: '',
        is_valid: 1,
        value_type: 'array',
        value: [ group ],
        remark: '用于设置字典分组',
      });
      await dict.save();
    } else {
      if (res.value.some(item => item.sp_name === sp_name)) {
        return this.fail('组别名重复');
      }
      res.value.push({ name, sp_name, remark });
    }
    this.succ();
  }
}

module.exports = DictController;
