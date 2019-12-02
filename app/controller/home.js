'use strict';
const crypto = require('crypto');
// const url = require('url');
const Controller = require('egg').Controller;
// 进行sha1加密
function sha1(str) {
  const shasum = crypto.createHash('sha1');
  return shasum.update(str, 'utf-8').digest('hex');
}
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(ctx.request.query);
    const { signature, timestamp, nonce } = ctx.request.query;
    const reqArray = [ nonce, timestamp, 'cbzxw' ];
    reqArray.sort();
    const sortStr = reqArray.join(''); // 连接数组
    const sha1Str = sha1(sortStr.toString().replace(/,/g, ''));
    if (signature === sha1Str) {
      // res.end(echostr);
      ctx.body = 'true';
    } else {
      ctx.body = 'false';
    }
  }
  async wechatAuth() {
    const { ctx } = this;
    console.log(ctx.request.query);
    const { signature, echostr, timestamp, nonce } = ctx.request.query;
    const reqArray = [ nonce, timestamp, 'cbzxw' ];
    reqArray.sort();
    const sortStr = reqArray.join(''); // 连接数组
    const sha1Str = sha1(sortStr.toString().replace(/,/g, ''));
    if (signature === sha1Str) {
      // res.end(echostr);
      ctx.body = echostr;
    } else {
      ctx.body = 'false';
    }
  }
}


module.exports = HomeController;
