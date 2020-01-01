'use strict';

const Controller = require('egg').Controller;
const Wechat = require('../../utils/wechat');
const wechat = Wechat.getInstance();
class IndexController extends Controller {
  async login() {
    const { code, state } = this.ctx.request.query;
    let url = decodeURIComponent(state);
    url = url.replace('bssfood_', '');
    if (!code) {
      if (url.indexOf('/mb') > -1) {
        let link = '?';
        if (url.indexOf('?') > -1) {
          link = '&';
        }
        return this.ctx.redirect(url + link + 'wxValid=true');
      }
      return this.ctx.redirect('/mb/');
    }
    const json = await wechat.getCodeToken(code);
    console.log('json', json);
    console.log(typeof json);
    const wxUser = await wechat.getUserInfo(json.access_token, json.openid);
    console.log('得到微信User对象', wxUser);
    // { openid: 'o5W010h6MfsZS-j1ZEUE-ZwKPelA',
    // 	nickname: '歪歪😰',
    // 	sex: 1,
    // 	language: 'zh_CN',
    // 	city: '',
    // 	province: '维也纳',
    // 	country: '奥地利',
    // 	headimgurl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Vu0c5PibbGxXRRsjAUJnllGWGeXbibV2eQtgCOLCAnORQey6l5f46ZMyD0qgLiaez1fPIoWmFBicnZuQKmd7ibias4ww/132',
    // 	privilege: [] }
    let user = await this.ctx.model.User.findOne({ open_id: wxUser.openid });
    if (user) { // 找到user并登录
      this.ctx.session.user = user;
    } else {
      user = new this.ctx.model.User({
        username: wxUser.nickname, // 登录用户名
        sex: wxUser.sex, // 0 女 1男
        head_img: wxUser.headimgurl, // 图片url
        nickname: wxUser.nickname, // 昵称
        open_id: wxUser.openid,
        token: json.access_token,
      });
      await user.save();
      this.ctx.session.user = user;
    }
    this.ctx.redirect('/mb/');
  }
}

module.exports = IndexController;

