'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const now = Date.now;
  const AdminSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String },
    mobile: { type: String },
    email: { type: String },
    status: { type: Number, default: 1 },
    role_id: { type: Schema.Types.ObjectId }, //   角色id
    create_time: {
      type: Number,
      default: now,
    },
    is_super: { type: Number, default: 0 }, // 是否是超级管理员      1表示超级管理员
  });
  return mongoose.model('Admin', AdminSchema, 'admin');
};
