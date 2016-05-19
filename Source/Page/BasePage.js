'use strict';
import React, {
  WebView,
  View,
  Component,
  ProgressBarAndroid,
  StyleSheet,
  PropTypes,
  InteractionManager,
} from 'react-native';

var NavigationBar = require('../common/NavigationBar');
var GlobalColor = require('../common/GlobalColor');

export default class BasePage extends React.Component {
  /*-----------------------------react native 方法-----------------------*/
  constructor(props) {
    super(props);
    //初始化方法配置，首先配置
    this.state = {
      isLoadedData: false,
    };
    //绑定方法
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.fetchData();
    });
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    var contentView = null;
    if(this.isShowLoadingProgress && !this.state.isLoadedData) {
      contentView = this.renderLoadingView();
    }
    else {
      contentView = this.renderContentView();
    }

    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        {contentView}
      </View>
    );
  }

  renderNavigationBar() {
    if(this.navigationBarConf === undefined) {
      this.navigationBarConf = this.navigationBarConfInfo();
    }
    if(this.navigationBarConf.rightIcon !== undefined && this.navigationBarConf.rightButtonPress !== undefined) {
      return (
        <NavigationBar
          navigator={this.props.navigator}
          backgroundColor={GlobalColor.mainColor}
          title={this.props.title}
          isShowBackView={this.navigationBarConf.isShowBack}
          rightIcon={this.navigationBarConf.rightIcon}
          pressRightButton={this.navigationBarConf.rightButtonPress}
        />
      );
    }
    else {
      return (
        <NavigationBar
          navigator={this.props.navigator}
          backgroundColor={GlobalColor.mainColor}
          title={this.props.title}
          isShowBackView={this.navigationBarConf.isShowBack}
        />
      );
    }
  }

  /*-----------------------------子类覆写的方法-----------------------*/
  /**
   * 加载数据，由子类覆写
   */
  fetchData() {

  }

  /**
   * 返回一个navigationBar的配置信息
   * @return 返回是对象，拿取对象中
   * {
   * isShowBack 是否显示返回按钮
   * rightIcon 是否显示导航栏右边按钮
   * rightButtonPress 导航栏右边按钮点击事件
   * }
   */
  navigationBarConfInfo() {
    return {
      isShowBack: true,
    };
  }

  /**
   * 渲染具体内容方法，由子类覆写
   */
  renderContentView() {
    return null;
  }

  /**
   * 是否显示加载页面，默认YES，子类可以覆写
   */
  get isShowLoadingProgress() {
    return true;
  }

  /**
   * 渲染加载页面
   */
  renderLoadingView() {
    return (
      <View style={styles.progressContainer}>
        <ProgressBarAndroid styleAttr={'Inverse'} color={GlobalColor.mainColor}/>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  //加载视图的布局
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  //整个容器的布局
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
});
