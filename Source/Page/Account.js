/**
 * 个人中心页面
 */

'use strict';
import React, {
  View,
  Text,
  TouchableHighlight,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

//本地化存储器
var GlobalColor = require('../common/GlobalColor');
var NavigationBar = require('../common/NavigationBar');
var WINDOW_WIDTH = Dimensions.get('window').width;
const PassCode = require('./PassCode');
const Login = require('./Login');
import AboutMe from './AboutMe';
import BGGlobal from '../common/BGGlobal';

var Acount = React.createClass({
  getInitialState: function() {
    return {
      passCode: '',
      userInfo: {},
    }
  },
  componentDidMount: function() {
    if(typeof(BGGlobal.passCode) === 'string' && BGGlobal.passCode.length > 0) {
      this.setState({
        passCode: BGGlobal.passCode
      });
    }
    //读取用户信息
    this.setState({
      userInfo: BGGlobal.userInfo,
    });
  },
  render: function() {
    var header = this._renderHeader();

    var passCodeRowTitle = '';
    if(this.state.passCode.length > 0) {
      passCodeRowTitle = '修改数字密码';
    }
    else {
      passCodeRowTitle = '启用数字密码';
    }
    var firstRow = this._renderRow(require('../../Resources/password.png'), passCodeRowTitle, 0);
    var secondRow = this._renderRow(require('../../Resources/about_me.png'), '关于我们', 1);

    var logout = this._renderLogout();
    var line = this._renderLine();
    var navigationBar = this._renderNavigationBar();
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {navigationBar}
        {header}
        {line}
        {firstRow}
        {line}
        {secondRow}
        {line}
        {logout}
      </ScrollView>
    );
  },
  _renderNavigationBar () {
    return (
      <NavigationBar
        navigator={this.props.navigator}
        backgroundColor={GlobalColor.mainColor}
        title={this.props.title}
        isShowBackView={true}
      />
    );
  },
  _renderHeader() {
    return (
      <View style={styles.header}>
        <Image style={styles.headerImage} source={require('../../Resources/acount_header.png')} />
        <Text style={styles.headerText}>{this.state.userInfo.mobile}</Text>
      </View>
    )
  },
  _renderRow(icon, text, id) {
    return (
      <TouchableHighlight underlayColor={GlobalColor.touchColor} onPress={this._pressRow.bind(this, id)}>
        <View style={styles.rowContainer}>
          <View style={styles.rowInnerContainer}>
            <Image style={styles.iconImage} source={icon} />
            <Text style={styles.text}>{text}</Text>
          </View>
          <Image style={styles.arrowImage} source={require('../../Resources/more.png')} />
        </View>
      </TouchableHighlight>
    );
  },
  _renderLogout() {
    return (
      <View style={styles.bottomView}>
        <TouchableHighlight style={styles.logoutButton} underlayColor='#D9D9D9' onPress={this._logout}>
        <Text style={styles.logoutText}>退出登录</Text>
        </TouchableHighlight>
      </View>
    );
  },
  _renderLine() {
    return (
      <View style={styles.line}/>
    );
  },

  _pressRow(id) {
    if(id === 0) {
      //数字密码
      if(this.state.passCode.length > 0) {
        this.props.navigator.push({
          title: '修改数字密码',
          component: PassCode,
          passProps: {
            type: 2,
            title: '修改数字密码',
            enterPasscodePrompt: '输入你的原始密码',
            enterNewPasscodePrompt: '输入你的新密码',
            confirmNewPasscodePrompt: '再次输入你的新密码',
            enterFailPrompt: '密码输入有误',
            confirmFailPrompt: '密码确认有误',
            originalPasscode: this.state.passCode,
            cancelButtonTitle: '忘记密码',
            cancelButtonTitleColor: 'blue',
            didCancel: this._passCodeDidCancel,
            didChange: this._passCodeDidChange,
          }
        });
      }
      else {
        this.props.navigator.push({
          title: '修改数字密码',
          component: PassCode,
          passProps: {
            type: 1,
            title: '启用数字密码',
            enterPasscodePrompt: '输入你的密码',
            confirmPasscodePrompt: '再次输入你的密码',
            enterFailPrompt: '密码输入有误',
            confirmFailPrompt: '密码确认有误',
            cancelButtonTitle: '取消',
            cancelButtonTitleColor: 'gray',
            didCancel: this._passCodeDidCancel,
            didSetNewPassCode: this._passCodeDidSetNewPasscode,
          }
        });
      }
    }
    else {
      //关于我们
      this.props.navigator.push({
        title: '关于我们',
        component: AboutMe,
      });
    }
  },

  //退出登录
  _logout() {
    BGGlobal.clearUserInfo();
    //回退到上个页面并且弹出登录
    this.props.navigator.push({
      component: Login,
      title: '登录',
      passProps: {
        loginSuccess: this._loginSuccess
      }
    });
  },

  _loginSuccess() {
    this.props.navigator.popToTop();
  },

  _passCodeDidCancel() {
    this.props.navigator.pop();
  },
  _passCodeDidSetNewPasscode(passCode) {
    BGGlobal.passCode = passCode;
    this.props.navigator.pop();
    //更新当前页面
    this.setState({
      passCode: passCode
    });
  },
  _passCodeDidChange(passCode) {
    BGGlobal.passCode = passCode;
    this.setState({
      passCode: passCode
    });
    this.props.navigator.pop();
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',

  },
  //个人中心头的容器
  header: {
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  headerImage: {
    width: 80,
    height: 80,
  },
  headerText: {
    marginTop: 15,
    fontSize: 18,
  },
  //行的容器
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 45,
  },
  rowInnerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  iconImage: {
    marginLeft: 15,
  },
  text: {
    marginLeft: 10,
  },
  //箭头图片
  arrowImage: {
    marginRight: 15,
  },
  line: {
    backgroundColor: GlobalColor.lineColor,
    height: 1,
  },
  bottomView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logoutButton: {
    width: WINDOW_WIDTH-30,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logoutText: {
    color: 'gray',
    textAlign: 'center',
  }
});

module.exports = Acount;
