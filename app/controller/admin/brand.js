'use strict';

const BaseController = require('./base.js');
class BrandController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.modelName = 'Brand';
  }
}

module.exports = BrandController;
