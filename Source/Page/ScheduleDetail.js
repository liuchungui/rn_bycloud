/**
 * 待办事项详情
 */

'use strict';
import React, {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ProgressBarAndroid,
  Alert,
} from 'react-native';

import GlobalColor from '../common/GlobalColor';
import NavigationBar from '../common/NavigationBar';
import BGGlobal from '../common/BGGlobal';
import Network from '../common/Network';

//开启使用TimerMixin
import TimerMixin from 'react-timer-mixin';

module.exports = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function() {
    return {
      status: this.props.data.status,
      //是否是加载状态
      loading: false,
    };
  },
  render: function() {
    var data = this.props.data;
    // var data = {
    //   detail: '相帮应尽快开放大家快放假撒可富啊艰苦奋斗啊就疯狂大姐夫打卡饭卡减肥的萨克附近的刷卡',
    //   deadline: '2016.03.03',
    //   status: 1,
    // };
    //图片
    var imageSource = require('../../Resources/box.png');
    if(this.state.status == 2) {
      imageSource = require('../../Resources/check_box.png');
    }
    var loadView = null;
    if(this.state.loading) {
      loadView = (
        <ProgressBarAndroid styleAttr="Inverse" />
      );
    }
    return (
      <View style={styles.container}>
        <NavigationBar
          navigator={this.props.navigator}
          backgroundColor={GlobalColor.mainColor}
          title={this.props.title}
        />
        <Text style={styles.detailText}>{data.detail}</Text>
        <Text style={styles.timeText}>{"截止日期："+data.deadline}</Text>
        <TouchableOpacity style={styles.bottomContainer} onPress={this._pressOn}>
          <Image style={styles.image} source={imageSource} />
          <Text style={styles.finishText}>我完成了</Text>
        </TouchableOpacity>
        {loadView}
      </View>
    );
  },
  _pressOn() {
    //已经完成，点击无效果
    if(this.state.status == 2) {
      return;
    }
    Alert.alert('确定已完成事项？', null, [
      {text: '取消', onPress: () => {
      }},
      {},
      {text: '确定', onPress: () => {
        //设置加载状态
        this.setState({
          loading: true,
        });
        //提交完成
        var params = {
          pmiId: this.props.data.pmiId,
          pmId: this.props.data.pmId,
          detail: this.props.data.detail,
          moduleId: this.props.data.moduleId,
          projectId: this.props.projectId,
          userId: BGGlobal.userInfo.userId,
        };
        Network.post('submitFinish', params, response => {
          //设置完成
          this.setState({
            status: 2,
            loading: false,
          });
          //一秒之后返回
          this.setTimeout(
            () => {
              this.props.navigator.pop();
            },
            1000,
          );

          //完成回调
          this.props.submitFinishFunc();
        },
        err => {
          ToastAndroid.show('提交完成失败', ToastAndroid.SHORT);
        });
      }}
    ]);
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  detailText: {
    margin: 10,
    fontSize: 14,
    color: 'rgb(60, 60, 60)',
  },
  timeText: {
    fontSize: 14,
    margin: 10,
    color: 'black',
  },
  bottomContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  image: {
    height: 25,
    width: 25,
  },
  finishText: {
    fontSize: 14,
    color: 'black',
    margin: 10,
  },
});
