'use strict';
// 品牌管理
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 商品属性表
  const BrandSchema = new Schema({
    name: { type: String }, // 品牌名称
    sub_name: { type: String }, // 品牌简介
    logo: { type: String }, // 品牌logo
    img: { type: String }, // 代表图片
    remark: { type: String },
  });
  return mongoose.model('Brand', BrandSchema, 'brand');
};
