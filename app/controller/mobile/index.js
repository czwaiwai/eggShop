'use strict';

const BaseController = require('./base.js');

class IndexController extends BaseController {
  async index() {
    await this.succ();
  }
  async user() {
    const user = await this.ctx.model.User.findOne({ username: 'waiwai' });
    this.ctx.session.user = user;
    await this.succ({
      user,
    });
  }
  async home() {
    // 获取banner信息
    const banner = await this.groupByBanner('homeSwipe', 1);
    const recommends = await this.groupByBanner('banner_recommend', 1);
    const pcConfig = await this.ctx.model.Dict.find({
      sp_group: 'pcConfig',
    }, { _id: 0, sp_name: 1, value: 1 });
    // 按商品风格查询商品
    const style = await this.ctx.model.Attr.findOne({
      attr_name: 'myStyle',
    });
    // 查询product分类
    const productCates = await this.treeByName('product');
    const arr = style.attr_val.split(',');
    // 按风格分类商品展示
    const proTypes = [];
    arr.forEach(async sub => {
      const obj = {
        name: sub,
      };
      obj.products = await this.ctx.model.Product.find({
        'props.myStyle': sub,
      });
      proTypes.push(obj);
    });
    //
    // 查询Vr数据列表

    await this.succ({
      pcConfig,
      productCates,
      proTypes,
      banner,
      recommends,
    });
  }
  async productCategory() {
    // 查询product分类
    const res = await this.treeByName('product');
    await this.succ({
      list: res,
    });
  }
  async productList() {
    let { page, pageSize, typeId, type, subType, subNodeType, myStyle, brand, attr } = this.ctx.request.body;
    page = parseInt(page || 1);
    pageSize = parseInt(pageSize || 20);
    let catePath = subNodeType || subType || type;
    // 查询product分类
    const res = await this.treeByName('product');
    // 获取产品风格属性
    const style = await this.ctx.model.Attr.findOne({
      attr_name: 'myStyle',
    });
    // 查询产品属性开关类型
    const attrs = await this.ctx.model.Attr.find({
      attr_type: 'switch',
    });
    // 查询产品品牌
    const brands = await this.ctx.model.Brand.find({});
    // 获取全部产品
    // const mongoose = this.app.mongoose;
    let cate;
    const findParams = { on_sale: 1 };
    if (myStyle) {
      findParams['props.myStyle'] = myStyle;
    }
    if (brand) {
      findParams.brand_id = brand;
    }
    if (typeId) { // 特殊处理
      cate = await this.ctx.model.Category.findById(typeId);
      catePath = cate.path;
    }
    if (catePath) {
      findParams.category_path = new RegExp('^' + catePath);
    }

    if (attr) {
      findParams['props.' + attr] = '1';
    }
    const pageTotal = await this.ctx.model.Product.count(findParams);
    console.log(findParams, 'findParams');
    const products = await this.ctx.model.Product.find(findParams).skip((page - 1) * +pageSize).limit(+pageSize);
    await this.succ({
      page,
      pageSize,
      pageTotal,
      style,
      brands,
      attrs,
      cate,
      types: res,
      list: products,
    });
  }
  async productDetail() {
    const id = this.ctx.request.body.id;
    // 查询商品
    const product = await this.ctx.model.Product.findById(id);
    const category = await this.ctx.model.Category.findById(product.category_id);
    const pro = product.toObject();
    pro.category = category;
    // 查询商品所在分类
    await this.succ({
      info: pro,
    });
  }
}

module.exports = IndexController;
