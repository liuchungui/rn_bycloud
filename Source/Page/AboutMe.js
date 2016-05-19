'use strict';
import React, {
  WebView,
  View,
  Component,
} from 'react-native';

import {ServerBaseURL} from '../common/GlobalConst';

var NavigationBar = require('../common/NavigationBar');
var GlobalColor = require('../common/GlobalColor');

export default class AboutMe extends React.Component {
  render() {
    return (
      <View style={{flex:1}} >
        <NavigationBar
          navigator={this.props.navigator}
          backgroundColor={GlobalColor.mainColor}
          title={this.props.title}
          isShowBackView={true}
        />
        <WebView source={{uri:ServerBaseURL+'/aboutMe'}} />
      </View>
    );
  }
}
