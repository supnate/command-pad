const request = require('request');
const { app } = require('electron');
const Config = require('electron-config');

const config = new Config();

function guid() {
  return 'xyxyxyxy'.replace(/[xy]/g, (c) => {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); // eslint-disable-line
    return v.toString(16);
  });
}

function sendStat(data) {
  try {
    let uid = config.get('uid');
    if (!uid) {
      uid = 'u_' + guid();
      config.set('uid', uid);
    }
    const statData = Object.assign({
      platform: process.platform,
      version: app.getVersion(),
      uid,
      ACL: {
        '*': {
          read: false,
          write: false,
        },
      },
    }, data);

    const options = {
      url: 'https://leancloud.cn:443/1.1/classes/StatEntry',
      method: 'post',
      json: true,
      headers: {
        'User-Agent': 'request',
        'X-LC-Id': 'ejz2yHGR12p7CHA6DGIhINxd-gzGzoHsz',
        'X-LC-Key': 'WbXPrkcqSGsVMQpJRUbsW5uV',
        'Content-Type': 'application/json',
      },
      body: statData,
    };

    request(options, () => {});
  } catch (e) {} // eslint-disable-line
}

module.exports = sendStat;
