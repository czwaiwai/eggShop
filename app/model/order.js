'use strict';
// 品牌管理
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const now = Date.now();
  const OrderSchema = new Schema({
    // order_id: { type: Number }, // 订单id简化
    user_id: { type: Schema.Types.ObjectId }, // 用户ID
    order_status: { type: Number }, // 10 为待支付，11为已取消, 12退款中 13已完全退款 ，20为 已支付 ,21为部分退款, 30 为已发货 40 已完成
    products: [{
      product_id: { type: Schema.Types.ObjectId },
      brand_id: { type: Schema.Types.ObjectId },
      sku_id: { type: String },
      name: { type: String }, // 产品名称
      sub_name: { type: String }, // 规格拼接名称
      attr: { type: Object },
      price_props: { type: Object },
      img_tmb: { type: String }, // 产品缩略图
      num: { type: Number }, // 售卖的数量
      price: { type: Number }, // 商品单价
      total: { type: Number }, // 单个商品总价
    }],
    address: {
      name: { type: String }, // 联系人姓名
      mobile: { type: String },
      address: { type: String },
      province: { type: String },
      city: { type: String },
      county: { type: String },
    },
    pay_way: { type: String, default: 'wx' }, // 支付方式 'wx', 'ali'
    pay_id: { type: String, default: '' }, // 支付端信息编码 payId
    openid: { type: String, default: '' }, // 微信用户openid
    postage_no: { type: String, default: '' }, // 物流单号 -----
    postage_name: { type: String }, // 物流公司名称
    total_num: { type: Number }, // 总数量
    total_price: { type: Number }, // 商品总价
    fee: { type: Number, default: 0 }, // 邮费
    offer: { type: Number, default: 0 }, // 优惠金额
    // offerType: { type: String }, // 优惠方式
    need_price: { type: Number }, // 应付金额
    real_price: { type: Number }, // 实际支付
    refund_price: { type: Number }, // 退款总金额
    refunding: { type: Number }, // 表示申请退款状态 2:退款申请中... 1:退款中... 0:无意义
    create_at: { type: Number, default: now }, // 订单创建时间 下单时间
    update_at: { type: Number, default: now },
    pay_at: { type: Number, default: 0 }, // 支付时间
    send_at: { type: Number, default: 0 }, // 配送时间
    refund_at: { type: Number, default: 0 }, // 退款申请时间
    out_at: { type: Number, default: 0 }, // 退款完成时间
  });
  return mongoose.model('Order', OrderSchema, 'order');
};
