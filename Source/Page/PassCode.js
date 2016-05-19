'use strict'
import React, {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  PropTypes,
  Animated,
  AppState,
} from 'react-native';

var GlobalColor = require('../common/GlobalColor');
//开启使用TimerMixin
var TimerMixin = require('react-timer-mixin');

var PassCode = React.createClass({
  mixins: [TimerMixin],
  propTypes: {
    /**
     * 页面类型
     * 0：验证输入的数字密码是否正确 1：设置新的数字密码 2：修改数字密码
     * @type {[type]}
     */
    type: PropTypes.number,
    /**
     * 标题
     */
    title: PropTypes.string,
    /**
     * 原始密码
     * 注：输入数字密码和修改数字密码使用
     */
    originalPasscode: PropTypes.string,

    /**
     * 输入时顶部文字提醒
     * @type {string}
     */
    enterPasscodePrompt: PropTypes.string,

    /**
     * 确认密码时顶部提醒文字
     */
    confirmPasscodePrompt: PropTypes.string,

    /**
     * 输入新密码时提醒
     * @type {[type]}
     */
    enterNewPasscodePrompt: PropTypes.string,

    /**
     * 确认新密码时提醒
     * @type {[type]}
     */
    confirmNewPasscodePrompt: PropTypes.string,

    /**
     * 输入失败时提醒，输入密码和更改密码时使用
     * @type {[type]}
     */
    enterFailPrompt: PropTypes.string,

    /**
     * 再次确认失败时提醒，设置密码和更改密码时使用
     * @type {string}
     */
    confirmFailPrompt: PropTypes.string,

    /**
     * 顶部提醒文字颜色
     * @type {[type]}
     */
    promptColor: PropTypes.string,

    /**
     * 失败提醒文字颜色
     * @type {string}
     */
    failPromptColor: PropTypes.string,

    /**
     * 取消的文字
     * @type {[type]}
     */
    cancelButtonTitle: PropTypes.string,

    /**
     * 取消的文字颜色
     * @type {[type]}
     */
    cancelButtonTitleColor: PropTypes.string,

    /**
     * 取消数字密码输入
     * @type {function}
     */
    didCancel: PropTypes.func,

    /**
     * 成功输入新数字密码
     * (newPassCode) => {}
     */
    didSetNewPassCode: PropTypes.func,

    /**
     * 成功的修改了数字密码
     * (newPassCode) => {}
     */
    didChange: PropTypes.func,

    /**
     * 输入了正确的数字密码
     *
     */
    didEnterCorrect: PropTypes.func,

    /**
     * 输入密码错误时回调方法，只在输入密码时回调
     * (attempts) => {}
     */
    didEnterFailed: PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      type: 0,
      title: '身份验证',
      enterPasscodePrompt: '请输入密码',
      enterFailPrompt: '输入有误',
      confirmFailPrompt: '确认密码有误',
      cancelButtonTitle: '取消',
      cancelButtonTitleColor: 'blue',
      failPromptColor: 'red',
      promptColor: 'black',
      originalPasscode: '',
    };
  },

  getInitialState: function() {
    return {
      failedAttempts: 0,
      enterAlternativePasscode: '',
      isInputCorrectOriginPasscode: false,
      enterPassCode: '',
      failedPrompt: '',
      topPrompt: this.props.enterPasscodePrompt,
      translateX: new Animated.Value(0),
    }
  },

  render: function() {
    var header = this._renderHeader();
    var center = this._renderCenter();
    return (
      <View style={styles.container}>
      {header}
      {center}
      </View>
    );
  },

  componentDidMount: function() {
      this._toggleKeyboard();
  },

  //调出键盘
  _toggleKeyboard() {
      //手动调出键盘弹出，这里加个延时是为了防止alert进入，键盘无法自动弹出的问题
      var textField = this.refs["1"];
      this.setTimeout(
          () => {
              console.log("fuocus");
              textField.focus();
          },
          300,
      );
  },

  _renderHeader: function() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{this.props.title}</Text>
        <TouchableOpacity
          onPress={this.props.didCancel}
          style={styles.rightButton}
          underlayColor='#B0B0B0'
        >
          <Text style={[styles.rightButtonText, {color: this.props.cancelButtonTitleColor}]} >{this.props.cancelButtonTitle}</Text>
        </TouchableOpacity>
      </View>
    );
  },

  _renderCenter: function() {
    var letterArray = [];
    var length = this.state.enterPassCode.length;
    for(var i = 0; i < 4; i++) {
      //添加圆点
      if(i < length) {
        letterArray.push('\u25CF');
      }
      else {
        //添加空白字符
        letterArray.push(' ');
      }
    }

    //动画的style
    var animationStyle = {
      transform: [
        {translateX: this.state.translateX}
      ],
    };

    return (
      <View style={styles.centerContainer}>
        <View style={styles.centerTextContainer}>
        <Text style={[{color: this.props.promptColor}]}>{this.state.topPrompt}</Text>
        <Animated.View style={animationStyle}>
        <View style={styles.centerInnerContainer}>
          <Text style={styles.centerText}>{letterArray[0]}</Text>
          <Text style={styles.centerText}>{letterArray[1]}</Text>
          <Text style={styles.centerText}>{letterArray[2]}</Text>
          <Text style={styles.centerText}>{letterArray[3]}</Text>
        </View>
        <View style={styles.centerInnerContainer}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </View>
        </Animated.View>
        <Text style={[styles.bottomText, {color: this.props.failPromptColor}]}>{this.state.failedPrompt}</Text>
        </View>
        <TextInput
          ref="1"
          hidden={true}
          style={styles.centerInput}
          autoFocus={true}
          keyboardType={'numeric'}
          maxLength={4}
          value={this.state.enterPassCode}
          onChangeText={this._onChangeText}
        />
      </View>
    );
  },

  _onChangeText(text) {
    this.setState({
      enterPassCode: text
    });
    if(text.length == 4) {
      this._didEnterFourNumPasscode(text);
    }
  },

  _didEnterFourNumPasscode(text) {
    switch (this.props.type) {
      case 0:
        //不足四位验证码直接取消
        if(this.props.originalPasscode.length != 4) {
          this.props.didCancel();
          return;
        }
        if(this.props.originalPasscode === text) {
          this.props.didEnterCorrect();
        }
        else {
          this.setState({
            failedAttempts: this.state.failedAttempts + 1,
            failedPrompt: this.props.enterFailPrompt,
          });
          this._shakeAndClearPassCode();
          this.props.didEnterFailed(this.state.failedAttempts);
        }
        break;
      case 1:
        //初次输入
        if(this.state.enterAlternativePasscode.length === 0) {
          this.setState({
            enterAlternativePasscode: text,
            topPrompt: this.props.confirmPasscodePrompt,
          });
          this._clearPassCode();
        }
        else {
          if(this.state.enterAlternativePasscode === text) {
            this.props.didSetNewPassCode(text);
          }
          else {
            this.setState({
              failedAttempts: this.state.failedAttempts + 1,
              failedPrompt: this.props.confirmFailPrompt,
            });
            this._shakeAndClearPassCode();
          }
        }
        break;
      case 2:
        //不足四位验证码直接取消
        if(this.props.originalPasscode.length != 4) {
          this.props.didCancel();
          return;
        }
        if(this.state.isInputCorrectOriginPasscode){
          if(this.state.enterAlternativePasscode.length === 0) {
            this._clearPassCode();
            this.setState({
              enterAlternativePasscode: text,
              topPrompt: this.props.confirmNewPasscodePrompt
            });
          }
          else {
            if(this.state.enterAlternativePasscode === text) {
              this.props.didChange(text);
            }
            else {
              this.setState({
                failedAttempts: this.state.failedAttempts + 1,
                failedPrompt: this.props.confirmFailPrompt
              });
              this._shakeAndClearPassCode();
            }
          }
        }
        else {
          if(this.props.originalPasscode === text) {
            this.setState({
              isInputCorrectOriginPasscode: true,
              failedAttempts: 0,
              failedPrompt: '',
              topPrompt: this.props.enterNewPasscodePrompt,
            });
            this._clearPassCode();
          }
          else {
            this.setState({
              failedAttempts: this.state.failedAttempts + 1,
              failedPrompt: this.props.enterFailPrompt,
            });
            this._shakeAndClearPassCode();
          }
        }
        break;
      default:

    }
  },

  /**
   * 清空passCode
   */
  _clearPassCode: function() {
    this.setState({
      enterPassCode: '',
    });
  },

  /**
   * 晃动清空passCode
   */
  _shakeAndClearPassCode() {
    //执行弹跳动画
    this.state.translateX.setValue(80);
    Animated.spring(
      this.state.translateX,
      {
        toValue: 0,
        friction: 8,
        tension: 180,
      }
    ).start( (ret) => {
      this._clearPassCode();
    });
  }



});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#E0E0E0',
    height: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight:'bold'
  },
  rightButton: {
    width: 120,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    paddingLeft: 30,
  },
  rightButtonText: {
    fontSize: 14,
    textAlign: 'right',
  },

  centerContainer: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    // paddingBottom: 50,
    paddingTop: 100,
  },
  centerTextContainer: {
    alignItems: 'center',
    // backgroundColor: 'green',
  },
  centerInnerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  centerInput: {
    width: 0,
    height: 10,
  },
  centerText: {
    fontSize: 18,
    fontWeight:'bold',
    marginLeft: 5,
    marginRight: 5,
    width: 20,
    textAlign: 'center',
    marginTop: 15,
  },
  line: {
    marginLeft: 5,
    marginRight: 5,
    width: 20,
    height: 1,
    backgroundColor: GlobalColor.lineColor,
  },
  bottomText: {
    marginTop: 10,
    fontSize: 14,
  },
});

module.exports = PassCode;
