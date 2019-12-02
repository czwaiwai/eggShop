'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const date = Date.now();
  const SkuSchema = new Schema({
    pri_id: {
      type: String,
    },
    ori_price: {
      type: String, // 原价
    },
    price: {
      type: String, // 售价
    },
    num: {
      type: Number,
      default: 0,
    },
    img: {
      type: String,
    },
    can_sell: { // 1表示可以卖 0表示不能卖
      type: Number,
      default: 1,
    },
    others: { // 动态属性
      type: Object, // {size:'1',width:'60'}
    },
  });
  const ProductSchema = new Schema({
    name: { type: String },
    sub_name: { type: String },
    imgs: { type: [ String ] },
    brand_id: { type: Schema.Types.ObjectId }, //
    category_id: { type: Schema.Types.ObjectId },
    category_path: { type: String }, // 商品所在类目
    tag: { type: [ String ] },
    // vir_price: { type: String }, // 原价
    // sell_price: { type: Number }, // 卖出价格
    // stock: { type: Number, default: 0 }, // 库存 默认为0
    // unit: { type: String }, // 单位
    // sort: { type: Number }, // 商品排序
    // isHot: { type: Number, default: 0 }, // 是否 1：推荐商品 2：热卖商品 3:新品上市
    sell_num: { type: Number, default: 0 }, // 卖出数量
    view_count: { type: Number, default: 0 }, // 访问次数
    // sell_count: { type: Number, default: 0 }, // 卖出数量
    on_sale: { type: Number, default: 0 }, // 上下架 0为下架 1为上架
    // isValid: {type: Number, default: 0}, // 是否有效
    is_del: { type: Number, default: 0 }, // 是否删除
    // place: { type: String }, // 产地
    // brands: { type: String }, // 品牌名称
    attrs: {
      type: [ SkuSchema ],
    },
    price_props: {
      type: Object,
    },
    props: {
      type: Object, // [{size: '尺寸'}, {width: '宽度'}]
    },
    props_vals: { // 属性名和中文对应
      type: Object,
    },
    create_at: { type: Number, default: date },
    update_at: { type: Number, default: date },
    content: { type: String },
  });
  return mongoose.model('Product', ProductSchema, 'product');
};
