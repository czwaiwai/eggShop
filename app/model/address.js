'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // 商品属性表
  const AddressSchema = new Schema({
    name: { type: String },
    user_id: { type: Schema.ObjectId },
    mobile: { type: String },
    is_default: { type: Number, default: 0 }, // 为1表示默认地址
    address: { type: String },
    province_id: { type: Number },
    province: { type: String },
    city_id: { type: Number },
    city: { type: String },
    area_id: { type: Number },
    area: { type: String },
  });
  return mongoose.model('address', AddressSchema, 'address');
};

