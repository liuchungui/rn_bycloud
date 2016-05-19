'use strict';
import React, {
  View,
  Text,
  StyleSheet,
  PropTypes,
} from 'react-native';

module.exports = React.createClass({
  propTypes: {
    children: PropTypes.string.isRequired,
    textStyle: Text.propTypes.style,
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, this.props.textStyle]}>{this.props.children}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 30,
    backgroundColor: '#B0B0B0',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    marginLeft: 10,
  },
});
