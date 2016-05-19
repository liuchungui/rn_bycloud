/*!
 *
 * 封装Navigator
 * 所有的切换过场动画都是从底部往上；回退是从上往下
 * 这里需要注意是使用{...route.passProps}模仿NavigatorIOS的passProps
 */
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  StatusBar,
  } = React;

var NavigationBar = require('../common/NavigationBar');

module.exports = React.createClass({
  render: function(){
    return(
      <Navigator
        initialRoute={{name: this.props.initName, component: this.props.component, index:0}}
        configureScene={(route, navigator)=> {
          if(route.sceneConfigs;) {
            return route.sceneConfigs;
          }
          return Navigator.SceneConfigs.HorizontalSwipeJump;
        }
        renderScene={(route, navigator) => {
          const Component = route.component;
          return (
            <Component navigator={navigator} route={route} {...route.passProps}/>
          );
        }}/>
    );
  }
});
