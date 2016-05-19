'use strict';
import React, {
  View,
  TextInput,
  TouchableHighlight,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  ToastAndroid,
  Platform,
} from 'react-native';

//开启使用TimerMixin
var TimerMixin = require('react-timer-mixin');
var WINDOW_WIDTH = Dimensions.get('window').width;
var WINDOW_HEIGHT = Dimensions.get('window').height;
var ImageMarginTop = (WINDOW_HEIGHT-180)/4.0;
var ImageMarginBottom = (WINDOW_HEIGHT-180)/7.0;

var GlobalColor = require('../common/GlobalColor');
var Network = require('../common/Network');
var BGGlobal = require('../common/BGGlobal');

var Login = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function() {
    return {
      mobile: '',
      messageCode: '',
      messageCodeButtonTitle: '点击获取',
      enableLoginButton: false,
      mobileInputOnFocus: true,
      messageCodeOnFocus: false,
    }
  },
  render: function() {
    var loginButton = (
      <TouchableHighlight
        style={[styles.loginButton, {backgroundColor: '#C9C9C9'}]}
      >
        <Text style={styles.loginButtonTitle}>登陆</Text>
      </TouchableHighlight>
    );
    if(this.state.enableLoginButton) {
      loginButton = (
        <TouchableHighlight
          underlayColor={GlobalColor.touchColor}
          style={[styles.loginButton, {backgroundColor: GlobalColor.mainColor}]}
          onPress={this._loginButtonAction}
        >
          <Text style={styles.loginButtonTitle}>登陆</Text>
        </TouchableHighlight>
      )
    }

    return (
      <View style={styles.contentContainr}>
        <Image style={styles.image} source={require('../../Resources/log_icon.png')} />
        <View>
          <TextInput
            ref={"1"}
            style={styles.mobileInput}
            autoFocus={this.state.mobileInputOnFocus}
            underlineColorAndroid={GlobalColor.lineColor}
            keyboardType='phone-pad'
            placeholder='请输入手机号'
            placeholderTextColor={GlobalColor.placeholderColor}
            maxLength={11}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              //跳到下一个输入框
              this.refs["2"].focus();
            }}
            onChangeText={(text) => {
              //当输入了11位手机号时，自动跳转到输入验证码
              if(text.length === 11) {
                this.refs["2"].focus();
              }
              this.setState({
                mobile: text,
              });
            }}
            value={this.state.mobile}
          />
          <View style={styles.messgeCodeContainer}>
            <TextInput
              ref={"2"}
              style={styles.messageCodeInput}
              autoFocus={this.state.messageCodeOnFocus}
              underlineColorAndroid={GlobalColor.lineColor}
              keyboardType='phone-pad'
              placeholder='请输入短信验证码'
              placeholderTextColor={GlobalColor.placeholderColor}
              maxLength={6}
              onChangeText={this._onChangeText}
              value={this.state.messageCode}
            />
            <TouchableHighlight
              underlayColor={GlobalColor.touchColor}
              style={styles.messageCodeButton}
              onPress={this._messageCodeButtonAction}
            >
              <Text style={styles.messageCodeButtonTitle}>{this.state.messageCodeButtonTitle}</Text>
            </TouchableHighlight>
          </View>
        </View>
        {loginButton}
      </View>
    );
  },

  //短信验证码的输入框按钮值改变时调用的方法
  _onChangeText: function(text) {
    var enableLoginButton = false;
    //输入了手机号和短信验证码，开启登陆按钮
    if(text.length == 6 && this.state.mobile.length == 11) {
      enableLoginButton = true;
    }
    this.setState({
      messageCode: text,
      enableLoginButton: enableLoginButton
    });
  },

  _messageCodeButtonAction: function() {
    if(this.state.mobile.length != 11) {
      ToastAndroid.show('请输入正确的11位手机号', ToastAndroid.SHORT);
      return;
    }
    /**
     * 请求短信验证码
     */
    Network.post('sendMessageCode', {
      mobile: this.state.mobile
    }, (response)=> {
    }, (err)=> {
      ToastAndroid.show(err, ToastAndroid.SHORT);
    });

    /**
     * 实现倒计时
     */
    var timeCount = 60;
    this.setState({
      messageCodeButtonTitle: timeCount+'S',
    });
    var intervalID = this.setInterval(
      () => {
        if(--timeCount <= 0) {
          this.clearInterval(intervalID);
          this.setState({
            messageCodeButtonTitle: '点击获取',
          });
        }
        else {
          this.setState({
            messageCodeButtonTitle: timeCount+'S',
          });
        }
      },
      1000,
    );
  },

  _loginButtonAction: function() {
    if(this.state.mobile.length != 11) {
      ToastAndroid.show('请输入正确的11位手机号', ToastAndroid.SHORT);
      return;
    }
    if(this.state.messageCode.length != 6) {
      ToastAndroid.show('请输入正确的短信验证码', ToastAndroid.SHORT);
      return;
    }
    //来源
    var source = 0;
    if(Platform.OS == 'ios') {
      source = 0;
    }
    else {
      source = 1;
    }
    /**
     * 快速登录
     */
    Network.post('quickLogin', {
      mobile: this.state.mobile,
      code: this.state.messageCode,
      source: source,
    }, (response)=> {
      //将用户信息存入本地
      BGGlobal.userInfo = response.result;
      //快速登陆回调函数
      this.props.loginSuccess(response.result);
    }, (err)=> {
      ToastAndroid.show(err, ToastAndroid.SHORT);
    });
  },
});

var styles = StyleSheet.create({
  contentContainr: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  image : {
    marginTop: ImageMarginTop,
    marginBottom: ImageMarginBottom,
    width: 151,
    height: 42,
  },
  messageCodeInput: {
    // flex: 1,
    height: 40,
    width: WINDOW_WIDTH - 100 - 80 - 5,
    marginRight: 5,
  },
  mobileInput: {
    height: 40,
    width: WINDOW_WIDTH - 100,
  },
  //message code那一行的容器布局
  messgeCodeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  messageCodeButton: {
    width: 70,
    height: 30,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageCodeButtonTitle: {
    color: '#C9C9C9',
    textAlign: 'center',
  },
  loginButton: {
    width: WINDOW_WIDTH - 100,
    height: 30,
    // backgroundColor: '#C9C9C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginButtonTitle: {
    color: 'white',
    textAlign: 'center',
  },

});

module.exports = Login;
