/*!
 封装的导航栏
 使用例子：
 var NavigationBar = require(./NavigationBar);
 <NavigationBar
  navigator={this.props.navigator}
  backgroundColor='#10648b'
  title="详情页"
  isShowBackView={true}
 />

 属性说明：
 navigator 导航控制器
 backgroundColor 导航控制器的背景颜色
 title  导航控制器的标题
 isShowBackView 是否显示返回的箭头
 */

import React, {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  PropTypes,
  Navigator,
} from 'react-native';

module.exports = React.createClass({
  propTypes: {
    navigator: PropTypes.instanceOf(Navigator),
    backgroundColor: PropTypes.string,
    title: PropTypes.string,
    isShowBackView: PropTypes.bool,
    pressRightButton: PropTypes.func,
  },
  getDefaultProps: function() {
    return {
        backgroundColor: '#10648b',
        isShowBackView: true,
        pressRightButton: () => {},
    }
  },
  render: function(){
    var backView = null;
    var rightIconView = null;
    var title = this.props.title;
    var styleTitleArray = [styles.title];
    //导航栏的偏移量
    var adjustTitleOffset = 0;
    /**
     * 是否显示返回按钮
     */
    if(this.props.isShowBackView) {
      adjustTitleOffset -= 110;
      backView = (
        <TouchableOpacity style={[styles.row,styles.backButton]} onPress={this._pop}>
          <Image source={require('../../Resources/nav_back.png')}/>
        </TouchableOpacity>
      );
    }
    /**
     * 是否显示右边的Icon
     */
    if(this.props.rightIcon) {
      adjustTitleOffset += 110;
      rightIconView = (
        <TouchableOpacity style={[styles.row,styles.rightIcon]} onPress={this.props.pressRightButton}>
          <Image source={this.props.rightIcon} />
        </TouchableOpacity>
      );
    }
    else if(this.props.rightTitle) {
      adjustTitleOffset += 110;
      rightIconView = (
        <TouchableOpacity style={[styles.row,styles.rightIcon]} onPress={this.props.pressRightButton}>
          <Text style={styles.rightTitle}>{this.props.rightTitle}</Text>
        </TouchableOpacity>
      );
    }

    //设置导航栏的偏移量
    styleTitleArray.push({
      paddingLeft: adjustTitleOffset,
    });

    return (
      <View style={[styles.header, styles.row, styles.center, {backgroundColor: this.props.backgroundColor}]}>
        {backView}
        <View style={styleTitleArray}>
          <Text style={[styles.fontFFF, styles.titlePos]} numberOfLines={1}>{title}</Text>
        </View>
        {rightIconView}
      </View>
    );
  },

  _pop: function(){
    this.props.navigator.pop();
  }
});

var styles = StyleSheet.create({
  row: {
    flexDirection:'row'
  },
  header: {
    height:50,
    backgroundColor:'blue'
  },
  fontFFF:{
    color:'#fff',
    fontSize:17,
    fontWeight:'bold'
  },
  title: {
    flex:1,
    // backgroundColor: 'blue',
  },
  titlePos: {
    textAlign: 'center',
  },
  center: {
    justifyContent:'center',
    alignItems:'center'
  },
  backButton: {
    paddingLeft: 20,
    alignItems: 'center',
    width: 120,
    height: 80,
    // backgroundColor: 'red',
  },
  rightIcon: {
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 120,
    height: 80,
  },
  rightTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  }
});
