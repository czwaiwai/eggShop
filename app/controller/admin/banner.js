'use strict';

const BaseController = require('./base.js');
class BannerController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.modelName = 'Banner';
  }
}

module.exports = BannerController;
