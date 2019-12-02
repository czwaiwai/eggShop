'use strict';
const validator = require('./app/validator.js');
module.exports = app => {
  app.projectName = 'eggShop';
  app.ready(async () => {
    console.log('应用已启动');
  });
  app.beforeClose(async () => {
    console.log('应用已关闭');
  });
  // 加载自定义验证器
  validator(app);
};
