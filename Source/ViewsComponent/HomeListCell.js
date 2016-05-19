'use strict';
import React, {
  View,
  TouchableOpacity,
  Text,
  Component,
  StyleSheet,
  Image,
  TouchableHighlight
} from 'react-native';

var HomeListCell = React.createClass({
  render: function() {
    const data = this.props.data;
    return (
      <TouchableHighlight underlayColor='#A0A0A0' onPress={this.props.onPress}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
          <Text style={styles.text}>{data.projectName}</Text>
          <Text style={styles.text}>{data.signTime}</Text>
          </View>
          <Image style={styles.image} source={require('../../Resources/more.png')} />
        </View>
      </TouchableHighlight>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column',
  },
  text: {
    fontSize: 15,
  },
  image: {
    marginRight: 10,
  },
});

module.exports = HomeListCell;
