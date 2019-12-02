/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_czwaiwai';

  config.session = {
    key: 'SESSION_ID',
    maxAge: 60 * 1000 * 60, // 一个小时内有效
    httpOnly: true,
    encrypt: true,
    renew: true, //  延长会话有效期
  };
  config.validate = {
    covert: true,
    widelyUndefined: true,
  };
  // 关闭scrf
  config.security = {
    csrf: {
      enable: false,
    },
  };
  // add your middleware config here
  config.middleware = [ 'adminAuth', 'indexAuth' ];
  config.adminAuth = {
    match: '/admin',
  };
  config.indexAuth = {
    match: '/api',
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    // 配置mongose连接mongodb数据库
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1/eggshop',
        options: {},
      },
    },
  };
  return {
    ...config,
    ...userConfig,
  };
};
