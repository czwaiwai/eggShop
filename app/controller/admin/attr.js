'use strict';

// const Controller = require('egg').Controller;
const BaseController = require('./base');
class AttrController extends BaseController {
  async index() {
    const { is_price } = this.ctx.request.query;
    const res = await this.ctx.model.Attr.aggregate([
      { $match: { is_price: parseInt(is_price) } },
      { $lookup: {
        from: 'category',
        localField: 'category_id',
        foreignField: '_id',
        as: 'category',
      } },
    ]);
    this.succ({
      list: res,
    });
  }
  async detail() {
    const { _id } = this.ctx.request.query;
    const res = await this.ctx.model.Attr.findById(_id);
    this.succ({
      info: res,
    });
  }
  async doAdd() {
    const body = this.ctx.request.body;
    const product = new this.ctx.model.Attr(body);
    await product.save();
    this.succ();
  }
  async doEdit() {
    const { _id, ...other } = this.ctx.request.body;
    await this.ctx.model.Attr.updateOne({ _id }, other);
    this.succ();
  }
  async doDel() {
    const { _id } = this.ctx.request.body;
    await this.ctx.model.Attr.deleteOne({ _id });
    this.succ();
  }
  // 根据categoryId查询 所有相关联的属性
  async getAttrByCate() {
    const { category_id } = this.ctx.request.query;
    const cate = await this.ctx.model.Category.findById(category_id);
    const arr = cate.path.split(',');
    const cates = await this.ctx.model.Category.find({ name_en: { $in: arr } }, '_id');
    const cateIds = cates.map(item => item._id);
    const res = await this.ctx.model.Attr.find({ category_id: { $in: cateIds } });
    this.succ({
      list: res,
    });
  }
}

module.exports = AttrController;
