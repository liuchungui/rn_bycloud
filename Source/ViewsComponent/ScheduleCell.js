/**
 * 待办事项的cell
 * 需要传递待办事项的数据进来
 */
'use strict';
import React, {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  PropTypes,
  TouchableHighlight,
} from 'react-native';

import GlobalColor from '../common/GlobalColor';
import Device from '../common/Device';
import Button from '../common/Button';

module.exports = React.createClass({
  propTypes: {
    //整个cell点击
    onPress: PropTypes.func.isRequired,
    //点击box触发的事件
    didClikBox: PropTypes.func.isRequired,
    //数据
    // data: PropTypes.object.isRequired,
  },
  getDefaultProps: function(){
    return {
    };
  },
  render: function() {
    var data = this.props.data;
    var detail = String(data.detail).replace(/\n/g, "; ");
    //圆的颜色
    var circularColor = 'black';
    //文字颜色
    var textColor = 'black';
    //提醒颜色
    var tipColor = GlobalColor.mainColor;
    //图片
    var imageSource = require('../../Resources/box.png');
    //是否屏蔽
    var disabled = false;
    switch (data.status.toString()) {
      case '1': {
      }
        break;
      case '2': {
        circularColor = GlobalColor.disableTextColor;
        textColor = GlobalColor.disableTextColor;
        tipColor = GlobalColor.disableTextColor;
        imageSource = require('../../Resources/check_box.png');
        disabled = true;
      }
        break;
      case '3': {
        tipColor = 'red';
      }
        break;
      default:
    }

    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor={GlobalColor.underlayColor}
      >
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={[styles.circular, {backgroundColor: circularColor}]} />
            <Text numberOfLines={1} style={[styles.content, {color: textColor}]}>{detail}</Text>
          </View>
          <View style={styles.innerContainer}>
            <View style={[styles.tipContainer, {borderColor: tipColor}]}>
              <Text style={[styles.tipText, {color: tipColor}]}>{this.props.data.deadline}</Text>
            </View>
            <Button
                disabled={disabled}
                style={styles.button}
                imageStyle={styles.image}
                onPress={this.props.didClikBox}
                imageSource={imageSource}
            />
          </View>
        </View>
      </TouchableHighlight>
    );

  },
});

var styles = StyleSheet.create({
  //容器
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'white',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  //圆
  circular: {
    margin: 10,
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  //内容
  content: {
    fontSize: 16,
    width: Device.scrrenWidth - 155,
  },
  //提醒的容器
  tipContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    borderWidth: 1,
    width: 80,
  },
  tipText: {
    textAlign: 'center',
    fontSize: 12,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  image: {
    width: 25,
    height: 25,
  },

});
