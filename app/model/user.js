'use strict';
module.exports = app => {
  const mongoose = app.mongoose; /* 引入建立连接的mongoose */
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    username: { type: String }, // 登录用户名
    pwd: { type: String, default: '' }, // 密码
    is_lock: { type: Number, default: 0 }, // 0表示用户正常 1表示用户被锁定
    email: { type: String }, // 邮件
    sex: { type: Number }, // 0 女 1男
    head_img: { type: String, default: '' }, // 图片url
    nickname: { type: String, default: '' }, // 昵称
    realname: { type: String }, // 真实姓名
    card_id: { type: String }, // 用户证件
    mobile: { type: String }, // 手机号吗
    weixin_id: { type: String }, // 微信weixinId
    // token: { type: String }, // 微信access_token
    create_at: { type: Number, default: Date.now },
    update_at: { type: Number, default: Date.now },
  });
  return mongoose.model('User', UserSchema, 'user');
};
