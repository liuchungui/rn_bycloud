'use strict'
import React, {
  Image,
  StyleSheet,
  View,
  Component,
  Dimensions,
  StatusBar,
} from 'react-native';

var WINDOW_WIDTH = Dimensions.get('window').width;
var WINDOW_HEIGHT = Dimensions.get('window').height;
class LanunchPage extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Image
        resizeMode={'cover'}
        source={require('image!splash')}
        style={{width: WINDOW_WIDTH, height: WINDOW_HEIGHT}}
        />
      </View>
    );
  }
}

module.exports = LanunchPage;
