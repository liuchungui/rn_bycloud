/**
 * 全局存储的变量，例如用户信息，是否登陆
 */
'use strict';

//导入react-native-storage框架，进行本地存储
import Storage from 'react-native-storage';

const storage = new Storage({
  //最大容量1000条数据
  size: 1000,
  //默认过期时间，永不过期
  defaultExpires: null,
  //读写时在内存中缓存数据
  enabledCache: true,
});

class BGGlobal {
  constructor() {
    //读取所有属性
    storage.load({
      key: "userInfo"
    })
    .then( userInfo => {
      //是否登陆
      this.isLogin = true;
      this.globalUserInfo = userInfo;
    })
    .catch(err => {
      this.isLogin = false;
      this.globalUserInfo = undefined;
    });

    storage.load({
      key: "passCode"
    })
    .then( passCode => {
      this.globalPassCode  = passCode;
    })
    .catch(err => {
      this.globalPassCode = '';
    });

    storage.load({
      key: "isDidLogin"
    })
    .then( isDidLogin => {
      this.globalIsDidLogin = isDidLogin;
    })
    .catch(err => {
      this.globalIsDidLogin = false;
    });

    storage.load({
      key: "deviceToken"
    })
    .then( deviceToken => {
      this.globalDeviceToken = deviceToken;
    })
    .catch(err => {
      this.globalDeviceToken = '';
    });
  }

  set userInfo(userInfo) {
    this.isLogin = true;
    this.globalUserInfo = userInfo;
    storage.save({
      key: 'userInfo',
      rawData: userInfo
    });
  }
  set passCode(passCode) {
    this.globalPassCode = passCode;
    storage.save({
      key: 'passCode',
      rawData: passCode
    });
  }
  set isDidLogin(isDidLogin) {
    this.globalIsDidLogin = isDidLogin;
    storage.save({
      key: 'isDidLogin',
      rawData: isDidLogin
    });
  }
  set deviceToken(deviceToken) {
    this.globalDeviceToken = deviceToken;
    storage.save({
      key: 'deviceToken',
      rawData: deviceToken,
    });
  }
  get userInfo() {
    return this.globalUserInfo;
  }
  get passCode() {
    return this.globalPassCode;
  }
  get isDidLogin() {
    return this.globalIsDidLogin;
  }
  get deviceToken() {
    return this.globalDeviceToken;
  }

  clearUserInfo() {
    this.isLogin = false;
    storage.remove({
      key: 'userInfo'
    });
    storage.remove({
      key: 'passCode'
    });
  }
};

var global  = new BGGlobal();
module.exports = global;
