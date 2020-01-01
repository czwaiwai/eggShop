'use strict';

const BaseController = require('./base.js');
class CartController extends BaseController {
  async index() {
    const user = this.getUser();
    const res = await this.ctx.model.Cart.find({ user_id: user._id });
    await this.succ({
      list: res,
    });
  }
  async detail() {
    const { sku_id } = this.ctx.request.query;
    const { user } = this.ctx.session;
    console.log(sku_id, user._id, '怎么回事');
    const res = await this.ctx.model.Cart.findOne({ sku_id, user_id: user._id });
    await this.succ({ info: res });
  }
  async doAdd() {
    const body = this.ctx.request.body;
    const { user } = this.ctx.session;
    if (!user) {
      return this.fail('您还没有登录哦');
    }
    body.user_id = user._id;
    const { user_id, sku_id, num, ...other } = body;
    await this.ctx.model.Cart.findOneAndUpdate({ user_id, sku_id }, {
      $set: {
        user_id,
        sku_id,
        ...other,
      },
      $inc: { num },
    }, {
      upsert: true,
    });
    await this.succ({}, true);
  }
  async numChange() {
    const { user } = this.ctx.session;
    const { sku_id, num } = this.ctx.request.body;
    await this.ctx.model.Cart.findOneAndUpdate({ sku_id, user_id: user._id }, {
      $set: { num },
    });
    await this.succ({}, true);
  }
  async cartCheck() {
    const { user } = this.ctx.session;
    const carts = await this.ctx.model.Cart.find({ user_id: user._id, is_check: true });
    await this.succ({
      list: carts,
    });
  }
  async checkChange() {
    const { user } = this.ctx.session;
    let { skus } = this.ctx.request.body;
    const carts = await this.ctx.model.Cart.find({ user_id: user._id });
    console.log(carts);
    if (!skus) {
      skus = [];
    }
    carts.forEach(async cart => {
      if (skus.includes(cart.sku_id)) {
        if (!cart.is_check) {
          cart.is_check = true;
          await cart.save();
        }
      } else {
        cart.is_check = false;
        await cart.save();
      }
    });
    await this.succ();
  }
  async doDels() {
    const { ids } = this.ctx.request.body;
    if (!(ids instanceof Array)) return this.ctx.throw(500);
    await this.ctx.model.Cart.deleteMany({ _id: { $in: ids } });
    await this.succ({}, true);
  }
  async doDel() {
    const { _id } = this.ctx.request.body;
    await this.ctx.model.Cart.deleteOne({ _id });
    await this.succ({}, true);
  }
}

module.exports = CartController;
