/**
 * 项目状态的标题，例如‘前期准备阶段’
 */
 'use strict';
 import React, {
   View,
   Text,
   StyleSheet,
   PropTypes,
   TouchableOpacity,
 } from 'react-native';

const GlobalColor = require('../common/GlobalColor');
var ProjectStateTitleCell = React.createClass({
   statics: {
     height: 50,
   },
   render: function() {
     var title = '';
     if(typeof(this.props.data.content) === 'string') {
       title = this.props.data.content;
     }
     var evaluateButton = null;
     if(this.props.data.needEvaluate) {
       evaluateButton = (
         <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
           <Text style={styles.buttonText}>评论</Text>
         </TouchableOpacity>
       );
     }
     return (
       <View style={styles.container}>
          <View style={styles.line}/>
          <View style={styles.content}>
            <Text style={styles.text}>{title}</Text>
          </View>
          {evaluateButton}
       </View>
     );
   },

 });

 const styles = StyleSheet.create({
   container: {
     flexDirection: 'row',
     alignItems: 'center',
     height: ProjectStateTitleCell.height,
    //  backgroundColor: 'red',
   },
   line: {
     height: ProjectStateTitleCell.height,
     marginLeft: 39.5,
     marginRight: 10,
     backgroundColor: GlobalColor.mainColor,
     width: 1,
   },
   text: {
     fontSize: 18,
     color: GlobalColor.mainColor,
     marginRight: 10,
    //  backgroundColor: 'blue',
     textAlign: 'center',
   },
   content: {
     flex: 1,
     flexDirection: 'row',
     alignItems: 'center',
   },
   button: {
     backgroundColor: GlobalColor.mainColor,
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: 3,
     width: 55,
     height: 25,
     marginRight: 50,
   },
   buttonText: {
     color: 'white',
     fontSize: 12,
   },
 });

 module.exports = ProjectStateTitleCell;
