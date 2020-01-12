'use strict';

const BaseController = require('./base');
class ProductController extends BaseController {
  async index() {
    let { on_sale, page, pageSize } = this.ctx.request.query;
    page = parseInt(page || 1);
    pageSize = parseInt(pageSize || 10);
    const params = {
      on_sale,
    };
    const total = await this.ctx.model.Product.count(params);
    const res = await this.ctx.model.Product.find(params).skip((page - 1) * +pageSize).limit(+pageSize);
    this.succ({
      list: res,
      page,
      pageSize,
      total,
    });
  }
  async detail() {
    const { _id } = this.ctx.request.query;
    const res = await this.ctx.model.Product.findById(_id);
    const obj = res.toObject();
    // 将skuSchema变为简单对象
    obj.attrs = obj.attrs.map(item => {
      return { ...item, ...item.others };
    });
    this.succ({
      info: obj,
    });
  }
  async doAdd() {
    const { basic, desc, attr: props, price, propsVals: props_vals } = this.ctx.request.body;
    const { prices, ...price_props } = price;
    // 存放在skuSchema中
    const attrs = prices.map(item => {
      const { pri_id, ori_price, can_sell, price, num, img, ...obj } = item;
      return {
        pri_id,
        ori_price,
        price,
        num,
        img,
        can_sell: can_sell || 1,
        others: obj, // 将动态的参数存放在对象中
      };
    });
    const productObj = {
      ...basic,
      category_id: this.app.mongoose.Types.ObjectId(basic.category_id),
      ...desc,
      props,
      price_props,
      attrs,
      props_vals,
    };
    if (basic.brand_id) {
      productObj.brand_id = this.app.mongoose.Types.ObjectId(basic.brand_id);
    }
    const product = new this.ctx.model.Product(productObj);
    await product.save();
    this.succ();
  }
  async doEdit() {
    const { basic, desc, attr: props, price, propsVals: props_vals } = this.ctx.request.body;
    const { prices, ...price_props } = price;
    // 存放在skuSchema中
    const attrs = prices.map(item => {
      const { _id, can_sell, pri_id, ori_price, price, num, img, ...obj } = item;
      delete obj.others;
      return {
        _id,
        pri_id,
        ori_price,
        price,
        num,
        img,
        can_sell,
        others: obj, // 将动态的参数存放在对象中
      };
    });
    const { _id, basicObj } = basic;
    const productObj = {
      ...basicObj,
      category_id: this.app.mongoose.Types.ObjectId(basic.category_id),
      ...desc,
      props,
      price_props,
      attrs,
      props_vals,
    };
    await this.ctx.model.Product.findByIdAndUpdate(_id, productObj);
    this.succ();
  }
  async doSale() {
    const { _id, on_sale } = this.ctx.request.body;
    await this.ctx.model.Product.updateOne({ _id }, { on_sale });
    this.succ();
  }
}

module.exports = ProductController;
