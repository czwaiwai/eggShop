'use strict';
// 轮播图
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const d = new Date();
  // 轮播图表
  const BannerSchema = new Schema({
    name: { type: String }, // 名称
    img: { type: String }, // 图片
    text: { type: String }, // 文字
    group_id: { type: Schema.Types.ObjectId }, // 分组id
    remark: { type: String },
    sort: { type: Number, default: 100 },
    create_at: { type: Number, default: d.getTime() },
    update_at: { type: Number, default: d.getTime() },
  });
  return mongoose.model('Banner', BannerSchema, 'banner');
};
