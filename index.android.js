/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  Text,
  View,
  StatusBar,
  BackAndroid,
  Navigator,
  Alert,
  ToastAndroid,
  AppState,
} from 'react-native';

//开启使用TimerMixin
var TimerMixin = require('react-timer-mixin');
var GlobalColor = require('./Source/common/GlobalColor');

import EditEvaluate from './Source/Page/EditEvaluate';
import BGGlobal from './Source/common/BGGlobal';
import FilePreview from './Source/Page/FilePreview';
import Network from './Source/common/Network';
import ScheduleList from './Source/Page/ScheduleList';
import ProjectFileList from './Source/Page/ProjectFileList';
import KeyboardAdjust from 'react-native-android-keyboard-adjust';

import UmengPush from 'react-native-umeng-push';

/**
 * 第一个显示的页面类型
 */
const PageType = {
  LaunchPage: 0,
  LoginPage: 1,
  PassCodePage: 2,
  HomePage: 3,
};

import Home from './Source/Page/HomeList';
import Launch from './Source/Page/Launch';
import ProjectProgress from './Source/Page/ProjectProgress';
import Login from './Source/Page/Login';
import PassCode from './Source/Page/PassCode';
import ScheduleDetail from './Source/Page/ScheduleDetail';
import Evaluate from './Source/Page/Evaluate';

var _navigator = null;

//监听硬件的back键操作
BackAndroid.addEventListener('hardwareBackPress', function() {
  if(_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var BYCloud_RN = React.createClass({
  getInitialState: function() {
    //enterPassCode 进入数字密码页面时，是否是直接验证数字密码对错
    return {
      pageType: PageType.LaunchPage,
    };
  },
  mixins: [TimerMixin],
  componentDidMount: function() {
    this.setTimeout(
      () => {
        this._checkIsDidLogin();
      },
      2000,
    );
    this._uploadDeviceToken();
    this._setupRemoteNotification();
    AppState.addEventListener('change', this._handleAppStateChange);
  },
  componentWillUnmount: function() {
    // 如果存在this.timer，则使用clearTimeout清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    this.timer && clearTimeout(this.timer);
    AppState.removeEventListener('change', this._handleAppStateChange);
  },

  renderScene: function(route, navigator) {
    _navigator = navigator;
    const Component = route.component;
    var title = route.title;
    if(title == undefined || title == null) {
      title = '';
    }
    return (
      <Component navigator={navigator} title={title} route={route} {...route.passProps}/>
    );
  },

  render: function(){
    // //暂时全部显示详情页面
    // return (
    //   <View style={{flex: 1}}>
    //     <StatusBar backgroundColor={GlobalColor.mainColor} barStyle="light-content" />
    //     <Navigator
    //       initialRoute={{title:'帮瀛云助理', component: ScheduleList, index:0, passProps: {pmid: 62, projectId: 21}}}
    //       configureScene={(route, navigator)=> {
    //         if(route.sceneConfigs) {
    //           return route.sceneConfigs;
    //         }
    //         return Navigator.SceneConfigs.HorizontalSwipeJump;
    //       }}
    //       renderScene={this.renderScene}
    //     />
    //   </View>
    // );
    // return;
    switch (this.state.pageType) {
      case 0:
          return this._renderLaunchPage();
      case 1:
          return this._renderLoginPage();
      case 2:
          return this._renderPassCodePage();
      case 3:
          return this._renderHomePage();
      default:
          return this._renderLaunchPage();
    }
  },

  _updatePageType: function(pageType) {
    this.setState({
      pageType: pageType
    });
    if(this.isShouldPush && pageType == PageType.HomePage) {
      //0.2秒之后，push到项目进度页面
      this.setTimeout(
        () => {
          this._pushToProjectProgressPage();
        },
        200,
      );
    }
  },

  //启动页面
  _renderLaunchPage: function() {
    //设置键盘不出现
    KeyboardAdjust.setAdjustNothing();
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={GlobalColor.mainColor} barStyle="light-content" />
        <Launch />
      </View>
    );
  },

  //登陆页面
  _renderLoginPage: function() {
    //总是出现
    KeyboardAdjust.setAlwaysVisible();
    return (
      <View style={{flex: 1}}>
        <StatusBar hidden={true} />
        <Login loginSuccess={this._loginSuccess}/>
      </View>

    );
  },

  //数字密码页面
  _renderPassCodePage: function() {
    //设置键盘
    KeyboardAdjust.setAlwaysVisible();

    var cancelButtonTitle = '取消';
    var cancelButtonTitleColor = 'gray';
    var type = 1;
    //去设置数字密码
    if(BGGlobal.passCode.length > 0) {
      cancelButtonTitle = '忘记密码';
      cancelButtonTitleColor = 'blue';
      type = 0;
    }
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={GlobalColor.mainColor} barStyle="light-content" />
        <PassCode
          type={type}
          enterPasscodePrompt='输入你的密码'
          confirmPasscodePrompt='再次输入你的密码'
          enterFailPrompt='密码输入有误'
          confirmFailPrompt='密码确认有误'
          cancelButtonTitle={cancelButtonTitle}
          cancelButtonTitleColor={cancelButtonTitleColor}
          originalPasscode={BGGlobal.passCode}
          didCancel={this._passCodeDidCancel}
          didEnterCorrect={this._passCodeDidEnterCorrect}
          didSetNewPassCode={this._passCodeDidSetNewPasscode}
          didEnterFailed={this._passCodeDidEnterFailed}
        />
      </View>
    );
  },

  //首页
  _renderHomePage: function() {
    //设置键盘不出现
    KeyboardAdjust.setAdjustNothing();
    return(
      <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor={GlobalColor.mainColor} barStyle="light-content" />
      <Navigator
        initialRoute={{title:'帮瀛云助理', component: Home, index:0}}
        configureScene={(route, navigator)=> {
          if(route.sceneConfigs) {
            return route.sceneConfigs;
          }
          return Navigator.SceneConfigs.FadeAndroid;
        }}
        renderScene={this.renderScene}
      />
      </View>
    );
  },

  //检查是否第一次进入，然后做对应的操作
  _checkIsDidLogin() {
    if(BGGlobal.isDidLogin) {
      //是否处于登陆状态
      if(BGGlobal.isLogin) {
        this._checkIsSetPassCode();
      }
      else {
        //进入登陆页面
        this._updatePageType(PageType.LoginPage);
      }
    }
    else {
      //进入登陆页面
      this._updatePageType(PageType.LoginPage);
    }
  },

  //检查是否设置了数字验证码
  _checkIsSetPassCode() {
    //存在passCode则进入设置passCode页面；否则进入登陆页面
    //注意：退出登陆的时候，需要清空这个值
    if(BGGlobal.passCode.length > 0) {
      //pass code 页面
      this._updatePageType(PageType.PassCodePage);
    }
    else {
      //进入登陆页面
      this._updatePageType(PageType.HomePage);
    }
  },

  /**
   * 登陆成功
   * @param  {object} userInfo 用户信息
   */
  _loginSuccess(userInfo) {
    this._uploadDeviceToken();
    //曾经登陆过，则直接进入主页面，否则弹出alert提醒用户设置数字密码
    if(BGGlobal.isDidLogin) {
      this._updatePageType(PageType.HomePage);
    }
    else {
      //记录登陆过
      BGGlobal.isDidLogin = true;
      Alert.alert(
        '设置密码可以让资料更安全哦~',
        '',
        [
          {text: '下次再设置', onPress: () => {
            Alert.alert(
              '下次可从个人中心进行密码设置哦',
              null,
              [
                {text: '我知道了', onPress: () => {
                  //进入主页面
                  this._updatePageType(PageType.HomePage);
                }},
              ]
            );
          }},
          {},
          {text: '设置数字密码', onPress: () => {
            this._updatePageType(PageType.PassCodePage);
          }}
        ]
      );
    }
  },

  _passCodeDidCancel() {
    //不是设置数字密码页面，则重新进入登陆页面
    if(BGGlobal.passCode.length > 0) {
      this._updatePageType(PageType.LoginPage);
    }
    else {
      Alert.alert(
        '下次可从个人中心进行密码设置哦',
        null,
        [
          {},
          {text: '我知道了', onPress: () => {
            //进入主页面
            this._updatePageType(PageType.HomePage);
          }},
          {},
        ]
      );
    }
  },

  _passCodeDidSetNewPasscode(passCode) {
    ToastAndroid.show('设置数字密码成功', ToastAndroid.SHORT);
    BGGlobal.passCode = passCode;
    this._updatePageType(PageType.HomePage);
  },

  _passCodeDidEnterCorrect() {
    this._updatePageType(PageType.HomePage);
  },

  _passCodeDidEnterFailed(failedAttempts) {
    if(failedAttempts >= 3) {
      this._updatePageType(PageType.LoginPage);
    }
  },

  //启动推送通知
  _setupRemoteNotification() {
    //获取到deviceToken
    UmengPush.getDeviceToken(deviceToken => {
      BGGlobal.deviceToken = deviceToken;
      this._uploadDeviceToken();
    });

    //接收到推送消息回调
    UmengPush.didReceiveMessage(message => {
      this._receivedRemoteNotification(message);
    });

    //点击推送消息打开应用回调
    UmengPush.didOpenMessage(message => {
      /**
       * 处理收到推送只有在app在活动状态才开始跳转，因为无法确定是推送先到还是app的状态先改变
       * remoteMessage 远程推送的消息，在app状态改变的方法里面使用这个值进行判断
       */
      if(AppState.currentState === 'active') {
        this.remoteMessage = undefined;
        this._receivedRemoteNotification(message);
      }
      else {
        this.remoteMessage = message;
      }
    });
  },

  _uploadDeviceToken() {
    //没有登录和deviceToken
    if(!BGGlobal.isLogin || typeof(BGGlobal.deviceToken) !== 'string' || BGGlobal.deviceToken.length == 0) {
      return;
    }
      console.log("uploadDeviceToken");
      // 上传设备token
      var params = {
          deviceToken: BGGlobal.deviceToken,
          userId: BGGlobal.userInfo.userId
      }
      Network.post('uploadDeviceToken', params, response => {
          console.log(response);
      }, err => {
          console.log(err);
      });
  },

  //收到远程推送通知
  _receivedRemoteNotification(data) {
    var extraInfo = JSON.parse(data.extra);
    if(extraInfo === undefined || extraInfo.pid === undefined) {
      return;
    }
    //没有进入主页面，则暂时不跳转进去
    if(this.state.pageType !== PageType.HomePage) {
      this.pushProjectId = extraInfo.pid;
      this.isShouldPush = true;
    }
    else {
      this.isShouldPush = false;
      this.pushProjectId = extraInfo.pid;
      var currentRoutes = _navigator.getCurrentRoutes();
      if(currentRoutes[currentRoutes.length - 1].component !== ProjectProgress) {
        //顶部组件非进程页面，则进入进程页面
        this._pushToProjectProgressPage();
      }
      else {
        //新路由替换当前路由
        _navigator.replace(this._projectProgressRoute());
      }
    }
  },

  _pushToProjectProgressPage() {
    _navigator.push(this._projectProgressRoute());
  },

  _projectProgressRoute() {
    return {
      component: ProjectProgress,
      passProps: {
        projectId: this.pushProjectId,
        selectIndex: 2,
      }
    };
  },

  _handleAppStateChange(appState) {
    this._uploadDeviceToken();
    var date = new Date();
    var timerInterval = date.getTime();
    if(appState == 'background') {
      this.timerInterval = timerInterval;
    }
    else if(appState == 'active') {
      //超过15秒之后，重新进入passcode页面
      if(timerInterval - this.timerInterval > 15000) {
        //存在passCode则进入数字密码验证页面
        if(BGGlobal.passCode.length > 0) {
          this._updatePageType(PageType.PassCodePage);
        }
      }
      /**
       * 此时app处于活动状态，判断remoteMessage是否有值，从而确定是否是从打开推送进入
       */
      if(this.remoteMessage !== undefined) {
        this._receivedRemoteNotification(this.remoteMessage);
      }
    }
  }
});

AppRegistry.registerComponent('BYCloud_RN', () => BYCloud_RN);
