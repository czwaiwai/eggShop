'use strict';


const BaseController = require('./base.js');

let times = 0;
class OrderController extends BaseController {
  async index() {
    let { page, pageSize, type } = this.ctx.request.query;
    page = parseInt(page || 1);
    pageSize = parseInt(pageSize || 20);
    type = parseInt(type);
    const { user } = this.ctx.session;
    const params = { user_id: user._id };
    if (type) {
      params.order_status = type;
    }
    const total = await this.ctx.model.Order.count(params);
    const list = await this.ctx.model.Order.find(params).skip((page - 1) * +pageSize).limit(+pageSize);
    await this.succ({
      page,
      pageSize,
      pageTotal: total,
      list,
    });
  }
  async detail() {
    const { _id } = this.ctx.request.query;
    const res = await this.ctx.model.Order.findById(_id);
    await this.succ({
      info: res,
    });
  }
  // 检测是否支付成功
  async checkOrderPay() {
    let isPay;
    if (times === 6) {
      isPay = true;
      times = 0;
    } else {
      times++;
      isPay = false;
    }
    await this.succ({
      isPay,
    });
  }
  async preOrder() {
    const user = this.getUser();
    const pros = await this.ctx.model.Cart.find({ user_id: user._id, is_check: true });
    const address = await this.ctx.model.Address.findOne({ user_id: user._id });
    await this.succ({
      list: pros,
      address,
    });
  }
  async cancel() {
    const { _id } = this.ctx.request.body;
    await this.ctx.model.Order.findOneAndUpdate({ _id }, { $set: { order_status: 11 } });
    await this.succ({}, true);
  }
  async doOrder() {
    // 先找到用户选中的购物车中的商品
    // cart product_id关联产品
    const { address_id } = this.ctx.request.body;
    if (!address_id) {
      return this.ctx.throw(403, {
        code: '1',
        msg: '用户地址不存在',
      });
    }
    // 查询用户的邮寄地址
    const address = await this.ctx.model.Address.findById(address_id);
    const { user } = this.ctx.session;
    const mongoose = this.app.mongoose;
    const carts = await this.ctx.model.Cart.aggregate([
      { $match: { user_id: mongoose.Types.ObjectId(user._id), is_check: true } },
      {
        $lookup: {
          from: 'product',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product',
        },
      }]);
    let total_num = 0;
    let total_price = 0;
    const products = carts.map(cart => {
      total_num += cart.num;
      const total = Math.round(cart.price * cart.num * 100) / 100;
      total_price += total;
      const priceKeys = Object.keys(cart.price_props);
      const priArr = priceKeys.map(item => {
        return cart.attr[item];
      });
      return {
        name: cart.name,
        sub_name: priArr.join('|'),
        product_id: cart.product_id,
        brand_id: cart.brand_id,
        attr: cart.attr,
        sku_id: cart.sku_id,
        img_tmb: cart.imgUrl,
        price_props: cart.price_props,
        num: cart.num,
        price: cart.price,
        total,
      };
    });
    total_price = Math.round(total_price * 100) / 100;
    // 生成订单记录
    const order = new this.ctx.model.Order({
      user_id: user._id,
      order_status: 10,
      products,
      address: {
        name: address.name,
        mobile: address.mobile,
        address: address.address,
        province: address.province,
        city: address.city,
        county: address.county,
      },
      total_num,
      total_price,
      need_price: total_price,
      real_price: total_price,
      fee: 0,
      offer: 0,
      pay_way: 'wx',
      pay_id: '',
      openid: '',
    });
    const res = await order.save();
    console.log(res);
    await this.ctx.model.Cart.deleteMany({ user_id: user._id, is_check: true });
    await this.succ({
      order_id: res._id,
    });
    // 清除用户所选中的购物车中的产品
  }
}

module.exports = OrderController;
