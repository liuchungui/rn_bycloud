/**
 * 项目某个阶段中某个状态的内容
 */
'use strict';
import React, {
  View,
  Text,
  StyleSheet,
  PropTypes,
  Dimensions,
} from 'react-native';

import GlobalColor from '../common/GlobalColor';
import Device from '../common/Device';

var ProjectStateContentCell = React.createClass({
  statics: {
    titleHeight: 25,
    padding: 10,
    marginBottom: 10,
  },
  propTypes: {
    /**
     * 显示的时间
     */
    time: PropTypes.string,
    /**
     * 显示的标题
     */
    title: PropTypes.string,
    /**
     * 显示的内容
     */
    content: PropTypes.string,
  },
  getDefaultProps: function() {
    return {
      time: '',
      title: '',
      content: '',
    };
  },
  getInitialState: function() {
    return {
      lineHeight: ProjectStateContentCell.titleHeight * 2 + ProjectStateContentCell.padding * 2 + ProjectStateContentCell.marginBottom,
    };
  },
  render: function() {
    //分割换行符需要加个\
    var contentArray = this.props.content.split('\\n', 1000);
    var rowArray = [];
    for(var i = 0; i < contentArray.length; i++) {
      rowArray.push(<Text key={i} numberOfLines={10}  style={styles.contentText} onLayout={this._textOnLayout}>{contentArray[i]}</Text>)
    }

    return (
      <View style={styles.container}>
        <View style={[styles.line, {height: this.state.lineHeight}]}/>
        <View style={styles.contentContainr}>
           <Text style={styles.timeText}>{this.props.time}</Text>
           <Text style={styles.titleText}>{this.props.title}</Text>
           {rowArray}
        </View>
      </View>
    );
  },

  _textOnLayout(layoutInfo) {
    // console.log("layout: " + layoutInfo.nativeEvent.layout.y);
    // console.log(layoutInfo.nativeEvent);
    this.setState({
      lineHeight: layoutInfo.nativeEvent.layout.height + ProjectStateContentCell.titleHeight * 2 + ProjectStateContentCell.padding * 2 + ProjectStateContentCell.marginBottom,
    });
  }

});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  line: {
    height: 10,
    marginLeft: 39.5,
    marginRight: 10,
    backgroundColor: GlobalColor.mainColor,
    width: 1,
  },
  timeText: {
    fontSize: 16,
    color: 'rgb(46, 46, 46)',
    height: ProjectStateContentCell.titleHeight,
  },
  titleText: {
    fontSize: 16,
    color: 'rgb(46, 46, 46)',
    height: ProjectStateContentCell.titleHeight,
  },
  contentText: {
    flex: 1,
    fontSize: 14,
    color: 'rgb(64, 64, 64)',
    // backgroundColor: 'red',
    width: Device.scrrenWidth-90-2*ProjectStateContentCell.padding,
  },
  contentContainr: {
    flex: 1,
    borderRadius: 5.0,
    backgroundColor: '#EFEFEF',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 40,
    padding: ProjectStateContentCell.padding,
    marginBottom: ProjectStateContentCell.marginBottom,
  }
});

module.exports = ProjectStateContentCell;
