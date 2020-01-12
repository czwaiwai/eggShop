'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const now = Date.now();
  const PageSchema = new Schema({
    title: { type: String },
    sp_name: { type: String },
    sub_title: { type: String },
    type: { type: Number, default: 0 }, // 0 普通单页  // 1分组
    mode: { type: Number, default: 0 }, // 0 内容模式 1 链接模式
    group_id: { type: Schema.Types.Mixed }, // 单页组 // 可能为空可能是id
    url: { type: String }, // url
    headimg: { type: String }, // 图片
    content: { type: String }, // 内容
    author: { type: String }, // 作者
    remark: { type: String }, // 备注
    is_valid: { type: Number, default: 0 }, // 0 无效 1有效
    read_count: { type: Number, default: 0 },
    create_at: { type: Number, default: now },
    update_at: { type: Number, default: now },
  });
  return mongoose.model('Page', PageSchema, 'page');
};
