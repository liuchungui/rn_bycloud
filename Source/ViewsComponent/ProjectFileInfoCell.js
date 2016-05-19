/**
 * 项目文件
 */
'use strict';
import React, {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

import Util from '../common/Util';
import GlobalColor from '../common/GlobalColor';
import Device from '../common/Device';

module.exports = React.createClass({
  render: function() {
    var fileName = this.props.data.name;
    //查找后缀
    var fileExtension = Util.pathExtension(fileName);
    return (
      <TouchableHighlight underlayColor={GlobalColor.underlayColor} onPress={this.props.onPress}>
        <View style={styles.container}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>{fileExtension}</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.fileNameText}>{fileName}</Text>
            <Text style={styles.time}>{this.props.data.uploadTime}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  },
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: '#A0A0A0',
  },

  iconText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },

  icon: {
    height: 50,
    width: 50,
    borderRadius: 5,
    backgroundColor: GlobalColor.mainColor,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  fileNameText: {
    width: Device.scrrenWidth - 85,
    fontSize: 16,
    color: 'rgb(60, 60, 60)',
    marginBottom: 5,
  },

  time: {
    fontSize: 14,
    color: 'rgb(110, 110, 110)',
  }
});
