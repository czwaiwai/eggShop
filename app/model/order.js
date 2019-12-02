'use strict';
// 品牌管理
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const now = Date.now();
  const OrderSchema = new Schema({
    orderId: { type: Number }, // 订单id简化
    userId: { type: Schema.ObjectId }, // 用户ID
    orderStatus: { type: Number }, // 10 为待支付，11为已取消, 12退款中 13已完全退款 ，20为 已支付 ,21为部分退款, 30 为已发货 40 已完成
    create_at: { type: Number, default: now },
    update_at: { type: Number, default: now },
    goods: [{
      goodsId: { type: Schema.ObjectId },
      name: { type: String }, // 产品名称
      subName: { type: String }, // 规格名
      imgTmb: { type: String }, // 产品缩略图
      sellPrice: { type: String }, // 售卖的价格
      num: { type: Number }, // 售卖的数量
    }],
    address: {
      name: { type: String },
      mobile: { type: String },
      place: { type: String },
    },
    type: { type: String, default: 'wx' }, // 支付方式 'wx', 'ali'
    payId: { type: String, default: '' }, // 支付端信息编码 payId
    openId: { type: String, default: '' }, // 微信用户openid
    postageId: { type: String, default: '' }, // 物流单号 -----
    postageName: { type: String }, // 物流公司名称
    totalNum: { type: Number }, // 总数量
    totalPrice: { type: Number }, // 商品总价
    fee: { type: Number, default: 0 }, // 邮费
    offer: { type: Number, default: 0 }, // 优惠金额
    needPrice: { type: Number }, // 应付金额
    offerType: { type: String }, // 优惠方式
    realPrice: { type: Number }, // 实际支付
    refundCurrPrice: { type: Number }, // 当次退款金额
    refundPrice: { type: Number }, // 退款总金额
    refunding: { type: Number }, // 表示申请退款状态 2:退款申请中... 1:退款中... 0:无意义
    pay_at: { type: Number }, // 支付时间
    refund_at: { type: Number }, // 退款申请时间
    out_at: { type: Number }, // 退款完成时间
  });
  OrderSchema.index({ name: 1 }, { unique: true });
  return mongoose.model('Order', OrderSchema, 'order');
};
