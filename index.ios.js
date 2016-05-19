/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Navigator,
} from 'react-native';

var GlobalColor = require('./Source/common/GlobalColor');
import BGGlobal from './Source/common/BGGlobal';
import FilePreview from './Source/Page/FilePreview';

class BYCloud_RN extends Component {
  renderScene(route, navigator) {
    const Component = route.component;
    return (
      <Component navigator={navigator} title={route.title} route={route} {...route.passProps}/>
    );
  }
  render() {
    //暂时全部显示详情页面
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={GlobalColor.mainColor} barStyle="light-content" />
        <Navigator
          initialRoute={{title:'帮瀛云助理', component: FilePreview, index:0, passProps: {progressName: '前期准备阶段'}}}
          configureScene={(route, navigator)=> {
            if(route.sceneConfigs) {
              return route.sceneConfigs;
            }
            return Navigator.SceneConfigs.HorizontalSwipeJump;
          }}
          renderScene={this.renderScene}
        />
      </View>
    );
    return;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('BYCloud_RN', () => BYCloud_RN);
