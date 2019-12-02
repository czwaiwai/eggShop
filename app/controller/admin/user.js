'use strict';

const BaseController = require('./base');
class UserController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.modelName = 'User';
  }
}

module.exports = UserController;
