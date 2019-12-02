'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 商品属性表
  const AttrSchema = new Schema({
    name: { type: String }, // 属性中文名
    attr_name: { type: String }, // 属性名
    category_id: { type: Schema.Types.ObjectId }, // 商品栏目id
    attr_type: { type: String, default: 'string' }, // 值类型 string|array|image|switch
    attr_val: { type: Schema.Types.Mixed },
    is_price: { type: Number, default: 0 }, // 是否商品价格相关属性 0表示与价格无关 1表示和价格相关
    remark: { type: String },
  });
  return mongoose.model('Attr', AttrSchema, 'attr');
};
