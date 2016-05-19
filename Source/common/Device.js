/**
 * 设备相关的信息，例如设备尺寸或者拨打电话
 */
'use strict';
import React, {
  Dimensions,
} from 'react-native';

var Device = {
  //屏幕宽度
  scrrenWidth: Dimensions.get('window').width,
  //屏幕高度
  scrrenHeight: Dimensions.get('window').height,
};

module.exports = Device;
