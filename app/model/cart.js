'use strict';
// 品牌管理
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 商品属性表
  const CartSchema = new Schema({
    name: { type: String }, // 产品名称
    user_id: { type: Schema.Types.ObjectId }, // 用户id
    product_id: { type: Schema.Types.ObjectId }, // 产品Id
    brand_id: { type: Schema.Types.ObjectId },
    sku_id: { type: String },
    attr: { type: Object }, // 产品规格
    price_props: { type: Object }, // 商品价格相关属性
    imgUrl: { type: String }, // 图片
    num: { type: Number, default: 1 }, // 数量
    is_check: { type: Boolean, default: false }, // 是否选中
    price: { type: Number }, // 单价
  });
  CartSchema.plugin(function(schema) {
    schema.methods.single_price = function() { // 单件小计
      return this.goodsNum * this.price;
    };
  });
  return mongoose.model('Cart', CartSchema, 'cart');
};

