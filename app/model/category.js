'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const CategorySchema = new Schema({
    name: { type: String },
    name_en: { type: String },
    sp_name: { type: String }, // 别名
    img_url: { type: String },
    path: { type: String, default: '0' },
    // deep: { type: Number, default: 1 }, // 深度
    parent: { type: Schema.Types.Mixed, default: '0' },
    type: { type: Number }, // 0表示无关联 1 产品类型 2 其他category 3 单页类型， 4列表类型
    front_url: { type: String }, // 前端路由
    other_id: { type: Schema.Types.Mixed }, // 关联的id  当type 2表示关联其他categoryId  当type为3时关联的是单页ID， 当type为3时关联的是列表id
    is_valid: { type: Number, default: 0 }, // 0表示无效 1表示有效
    is_single: { type: Number, default: 0 }, // 0表示多级 1 表示仅一个层级 子节点是选择为1
    sort: { type: Number, default: 100 },
    remark: { type: String },
  });
  return mongoose.model('Category', CategorySchema, 'category');
};
