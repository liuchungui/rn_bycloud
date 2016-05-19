'use strict';
import React, {
  View,
  Text,
  TouchableOpacity,
  PropTypes,
  Animated,
  StyleSheet,
  ListView,
  Dimensions,
  Easing,
} from 'react-native';

const ItemGap = 15;
const WINDOW_WIDTH = Dimensions.get('window').width;
const GlobalColor = require('../common/GlobalColor');

var SegmentView = React.createClass({
  propTypes: {
    items: PropTypes.array,
    selectIndex: PropTypes.number,
    didSelectIndexFunc: PropTypes.func.isRequired,
  },
  getDefaultProps: function(){
    return {
      items: [],
      didSelectIndexFunc: (index) => {},
      selectIndex: 0,
    };
  },
  getInitialState: function() {
    console.log("SegmentView getInitialState***");
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    var left = this.props.selectIndex*WINDOW_WIDTH/3.0+ItemGap;
    return {
      lineLeft: new Animated.Value(left),
      dataSource: dataSource.cloneWithRows(this.props.items),
    };
  },
  render: function() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.listView}
          contentContainerStyle={styles.listViewContent}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />
        <Animated.View style={[styles.line, {left: this.state.lineLeft}]} />
      </View>
    );
  },
  _renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity style={styles.row} onPress={this._didSelectIndex.bind(this, rowData, sectionID, rowID)}>
        <Text style={styles.text}>{rowData}</Text>
      </TouchableOpacity>
    );
  },

  _didSelectIndex(rowData, sectionID, rowID) {
    //动画移动到对应位置
    var left = rowID*WINDOW_WIDTH/3.0+ItemGap;
    Animated.timing(
      this.state.lineLeft,
      {
        toValue: left,
        duration: 200,
        easing: Easing.linear,
      }
    ).start((ret) => {
      this.props.didSelectIndexFunc(rowID);
    });
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: 50,
    backgroundColor: '#EFEFEF',
  },
  listView: {
    height: 50,
    // backgroundColor: '#E0E0E0',
  },
  listViewContent: {
    flex: 1,
    flexDirection: 'row',
  },
  row: {
    width: WINDOW_WIDTH/3.0,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'gray',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  line: {
    backgroundColor: GlobalColor.mainColor,
    height: 2,
    width: WINDOW_WIDTH/3.0-ItemGap*2,
  }
});

module.exports = SegmentView;
