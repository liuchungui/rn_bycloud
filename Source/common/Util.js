'use strict';
export default class Util {
  /**
   * 路径扩展
   */
  static pathExtension(fileName) {
    if(typeof(fileName) !== 'string') {
      console.warn("请传递字符串");
      return "";
    }
    var lastIndex = fileName.lastIndexOf(".");
    if(lastIndex === -1) {
      return "";
    }
    if(lastIndex + 1 >= fileName.length) {
      return "";
    }
    return fileName.slice(lastIndex + 1);
  }

  /**
   * 路径最后一部分
   */
  static lastPathCompoent(url) {
    if(typeof(url) !== 'string') {
      console.warn("请传递字符串");
      return "";
    }
    var lastIndex = url.lastIndexOf("/");
    if(lastIndex === -1) {
      return "";
    }
    if(lastIndex + 1 >= url.length) {
      return "";
    }
    return url.slice(lastIndex + 1);
  }

  /**
   * 去掉路径最后一部分
   */
  static deletingLastPathCompoent(url) {
    if(typeof(url) !== 'string') {
      console.warn("请传递字符串");
      return "";
    }
    var lastIndex = url.lastIndexOf("/");
    if(lastIndex === -1) {
      return "";
    }
    return url.substring(0, lastIndex);
  }
}
