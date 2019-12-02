'use strict';

const BaseController = require('./base.js');
class OrderController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.modelName = 'Order';
  }
}

module.exports = OrderController;
