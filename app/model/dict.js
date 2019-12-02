'use strict';
// 品牌管理
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const DictSchema = new Schema({
    name: { type: String }, // 属性显示名
    sp_name: { type: String }, // 别名
    group_id: { type: Schema.Types.Mixed }, // 分组id
    group_name: { type: String }, // 分组名
    sp_group: { type: String }, // 分组别名
    is_valid: { type: Number, default: 0 }, // 属性是否有效， 1为有效
    value_type: { type: String, enum: [ 'string', 'object', 'array', 'arrayobject', 'img', 'imgs', 'other' ] }, // 字符串|json|数组|其他|图片
    value: Schema.Types.Mixed, // 属性值
    remark: { type: String }, // 属性说明
  });
  DictSchema.index({ name: 1 }, { unique: true });
  return mongoose.model('Dict', DictSchema, 'dict');
};
