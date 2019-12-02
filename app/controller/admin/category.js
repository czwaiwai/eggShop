'use strict';

const BaseController = require('./base');
const trans = require('transliteration');
class CategoryController extends BaseController {
  async index() {
    const res = await this.ctx.model.Category.find({ path: /ke_ting/ });
    this.succ({
      list: res,
    });
  }
  async doRootAdd() {
    const { name, img_url, is_single, remark } = this.ctx.request.body;
    const name_en = trans.slugify(name, { separator: '_' });
    // name_en += '_' + Date.now();
    const category = new this.ctx.model.Category({
      name,
      name_en,
      path: name_en,
      img_url,
      is_single,
      remark,
      is_valid: '1',
    });
    await category.save();
    this.succ({
      info: {
        name,
        name_en,
        is_single,
      },
    });
  }
  async doRootEdit() {
    const { _id, name, ...other } = this.ctx.request.body;
    const name_en = trans.slugify(name, { separator: '_' });
    const root = await this.ctx.model.Category.findById(_id);
    await this.ctx.model.Category.updateOne({ _id }, {
      ...other,
      name,
      name_en,
      path: name_en,
    });
    if (root.name_en !== name_en) {
      const cates = await this.ctx.model.Category.find({ path: new RegExp('^' + root.path + ',') });
      cates.forEach(async item => {
        item.path = item.path.replace(root.name_en + ',', name_en + ',');
        await item.save();
      });
    }
    this.succ();
  }
  async doRootDel() {
    const { path } = this.ctx.request.body;
    await this.ctx.model.Category.deleteMany({ path: new RegExp('^' + path) });
    this.succ();
  }
  async rootList() {
    const res = await this.ctx.model.Category.find({
      parent: '0',
    });
    this.succ({
      list: res,
    });
  }
  async list() {
    const { path } = this.ctx.request.query;
    const res = await this.ctx.model.Category.find({ path: new RegExp('^' + path) }).lean();
    const tree = this.ctx.service.tools.toTree(res, '0');
    this.succ({
      list: tree,
    });
  }
  async treeByName() {
    const { sp_name } = this.ctx.request.query;
    const cate = await this.ctx.model.Category.findOne({ sp_name });
    let reg = '';
    if (cate.parent === '0') {
      reg = new RegExp('^' + cate.path);
    } else {
      reg = new RegExp(',' + cate.path);
    }
    const res = await this.ctx.model.Category.find({ path: reg }).lean();
    const tree = this.ctx.service.tools.toTree(res, '0');
    this.succ({
      list: tree,
    });
  }
  async doAdd() {
    const { name, path, parent, other_id, ...other } = this.ctx.request.body;
    const name_en = trans.slugify(name, { separator: '_' });
    const myPath = path + ',' + name_en;
    const mongoose = this.app.mongoose;
    const category = new this.ctx.model.Category({
      name,
      name_en,
      parent: mongoose.Types.ObjectId(parent),
      other_id: other_id ? mongoose.Types.ObjectId(other_id) : '',
      path: myPath,
      ...other,
    });
    await category.save();
    this.succ();
  }
  async doEdit() {
    let { _id, name, path, parent, other_id, ...other } = this.ctx.request.body;
    const name_en = trans.slugify(name, { separator: '_' });
    const cate = await this.ctx.model.Category.findById(_id);
    path = path.replace(new RegExp(',' + cate.name_en + '$'), ',' + name_en);
    const mongoose = this.app.mongoose;
    await this.ctx.model.Category.updateOne({ _id }, {
      ...other,
      name,
      name_en,
      parent: mongoose.Types.ObjectId(parent),
      other_id: other_id ? mongoose.Types.ObjectId(other_id) : '',
      path,
    });
    if (cate.name_en !== name_en) {
      const cates = await this.ctx.model.Category.find({ path: new RegExp(cate.path + ',') });
      cates.forEach(async item => {
        item.path = item.path.replace(cate.name_en + ',', name_en + ',');
        await item.save();
      });
    }
    this.succ();
  }
  async detail() {
    const { _id } = this.ctx.request.query;
    const res = await this.ctx.model.Category.findOne({ _id });
    this.succ({
      info: res,
    });
  }
  async doDel() {
    const { _id } = this.ctx.request.body;
    await this.ctx.model.Category.deleteOne({ _id });
    this.succ();
  }
}

module.exports = CategoryController;
