'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const now = Date.now();
  const PageGroupSchema = new Schema({
    name: { type: String },
    sp_name: { type: String },
    value: { type: String },
    type: { type: Number, default: 0 }, // 分组类型
    img: { type: String },
    remark: { type: String },
    create_at: { type: Number, default: now },
  });
  return mongoose.model('PageGroup', PageGroupSchema, 'page_group');
};
