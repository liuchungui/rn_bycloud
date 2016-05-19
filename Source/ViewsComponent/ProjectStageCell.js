/**
 * 案件阶段的cell
 */
'use strict';
import React, {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  PropTypes,
} from 'react-native';

import Button from '../common/Button';
import GlobalColor from '../common/GlobalColor';

var ProjectStageCell = React.createClass({
  statics: {
    height: 50,
    circularRadius: 5,
  },
  propTypes: {
    /**
     * 业务状态，0为还未开始，1为正在进行，2为已经完成
     * UI状态：0灰色，1主色，2黑色
     */
    status: PropTypes.number,
    /**
     * 是否显示顶部的一根竖线，默认false
     */
    showTopLine: PropTypes.bool,
    /**
     * 是否显示底部的一根竖线，默认false
     */
    showBottomLine: PropTypes.bool,
    /**
     * 显示的标题
     */
    title: PropTypes.string,
    /**
     * 是否展开
     * 默认不展开
     */
    // isExpand: PropTypes.bool,
    /**
     * 点击右边按钮调用的方法
     * (isExpand) => {}
     */
    didExpand: PropTypes.func,
  },
  getDefaultProps: function() {
    return {
      status: 0,
      showTopLine: false,
      showBottomLine: false,
      title: '',
      // isExpand: false,
      didExpand: (isExpand) => {},
    };
  },
  getInitialState: function() {
    //当正在进行时，默认进来是展开的
    var isExpand = false;
    if(this.props.status == 1) {
      isExpand = true;
    }
    return {
      isExpand: isExpand,
    };
  },
  render: function() {
    var circularColor = '#A0A0A0';

    if(this.props.status == 0) {
      circularColor = '#A0A0A0';
    }
    else if(this.props.status == 1) {
      circularColor = GlobalColor.mainColor;
    }
    else {
      circularColor = 'black';
    }

    var expandTitle = '展开';
    var imageSource = require('../../Resources/arrow.png');
    if(this.state.isExpand) {
      expandTitle = '收起';
      imageSource = require('../../Resources/arrow_top.png');
    }

    var topLineColor = 'rgba(255, 255, 255, 0)';
    var bottomLineColor = 'rgba(255, 255, 255, 0)';
    if(this.props.showTopLine) {
      topLineColor = GlobalColor.mainColor;
    }
    if(this.props.showBottomLine) {
      bottomLineColor = GlobalColor.mainColor;
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.line, {backgroundColor: topLineColor}]}/>
          <View style={[styles.circular, {backgroundColor: circularColor}]}/>
          <View style={[styles.line, {backgroundColor: bottomLineColor}]}/>
        </View>
        <View style={styles.content}>
          <Text style={styles.text}>{this.props.title}</Text>
          <Button
            onPress={this._clikButton}
            imageSource={imageSource}
            style={styles.button}
            textStyle={styles.buttonTextStyle}
          >
            {expandTitle}
          </Button>
        </View>
      </View>
    );
  },

  _clikButton() {
    this.setState({
      isExpand: !this.state.isExpand,
    });
    this.props.didExpand(this.state.isExpand);
  },

});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: ProjectStageCell.height,
    marginRight: 20,
  },
  header: {
    marginLeft: 30,
    alignItems: 'center',
    width: 20,
  },
  circular: {
    borderRadius: ProjectStageCell.circularRadius,
    height: ProjectStageCell.circularRadius*2,
    width: ProjectStageCell.circularRadius*2,
  },
  line: {
    // backgroundColor: '#101010',
    width: 1,
    height: (ProjectStageCell.height - ProjectStageCell.circularRadius*2)/2,
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'black',
    marginRight: 10,
  },
  button: {
    flex: 1,
    height: 40,
    justifyContent: 'flex-start',
  },
  buttonTextStyle: {
    fontSize: 14,
    color: GlobalColor.mainColor,
  },
});

module.exports = ProjectStageCell;
