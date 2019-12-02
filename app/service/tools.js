'use strict';
const svgCaptcha = require('svg-captcha'); // 引入验证
const Service = require('egg').Service;
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const images = require('images');
const sd = require('silly-datetime');
const pump = require('mz-modules/pump');
function toPromise(fn) {
  return function(data) {
    return new Promise((resolve, reject) => {
      fn(data, function(err) {
        if (err) reject(err);
        resolve();
      });
    });
  };
}
const mkdirpPromise = toPromise(mkdirp);
class ToolsService extends Service {
  // 生成验证码返回captcha对象
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 130,
      height: 52,
      background: '#cc9966',
    });

    this.ctx.session.imgCode = captcha.text; /* 验证码的信息*/

    return captcha;
  }
  toTree(list, parent = '0') {
    const arr = [];
    for (let i = 0; i < list.length; i++) {
      const data = list[i];
      if (data.parent.toString() === parent.toString()) {
        const childrens = this.toTree(list, data._id);
        if (childrens.length > 0) {
          data.children = childrens;
        }
        arr.push(data);
      }
    }
    return arr;
  }
  getFileName(url) {
    return url.replace(/(.*\/)*([^.]+).*/ig, '$2');
  }
  getFileType(url) {
    return path.extname(url);
  }
  // 创建3张关联图片
  formatImg(fileUrl) {
    const img = images(fileUrl);
    const fileName = this.getFileName(fileUrl);
    const imgType = this.getFileType(fileUrl);
    const dir = path.dirname(fileUrl) + '/';
    const fullName = dir + fileName + '_$' + img.width() + 'x' + img.height();
    img.save(fullName + imgType);
    const img600 = img.resize(600);
    const img600Name = fullName + '_$middle' + img600.width() + 'x' + img600.height();
    img600.save(img600Name + imgType, { quality: 80 });
    const img300 = img.resize(300);
    const img300Name = img600Name + '_$small' + img300.width() + 'x' + img300.height();
    img300.save(img300Name + imgType, { quality: 60 });
    fs.unlink(fileUrl, err => console.log(err)); // 删除原始上传的图片
    return img300Name + imgType;
  }
  async upload() {
    const stream = await this.ctx.getFileStream();
    const date = sd.format(new Date(), 'YYYYMMDD');
    const dir = 'app/public/upload/' + date + '/';
    await mkdirpPromise(dir);
    const streamName = path.basename(stream.filename);
    const fileName = this.getFileName(streamName);
    const imgType = this.getFileType(streamName);
    const fileUrl = dir + fileName + '_' + date + parseInt(Math.random() * 10000) + imgType;
    const ws = fs.createWriteStream(fileUrl);

    await pump(stream, ws);
    console.log(fileUrl, 'hahahah');
    const imgUrl = this.formatImg(fileUrl);
    return {
      url: imgUrl.replace(/^app/, ''),
      fields: stream.fields,
    };
  }
}

module.exports = ToolsService;
