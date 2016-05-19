/**
 * 评论编辑页面
 */

'use strict';
import React, {
  View,
  TextInput,
  Component,
  TouchableOpacity,
  StyleSheet,
  PropTypes,
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import GlobalColor from '../common/GlobalColor';

export default class EditEvaluate extends Component {
  static propTypes = {
    editFinish: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
    this._editEvaluateFinish = this._editEvaluateFinish.bind(this);
  }
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          navigator={this.props.navigator}
          backgroundColor={GlobalColor.mainColor}
          title={this.props.title}
          rightTitle='完成'
          pressRightButton={this._editEvaluateFinish}
        />
        <TextInput
          style={styles.inputText}
          value={this.state.value}
          onChangeText={(text) => {
            this.setState({
              value: text
            });
          }}
          autoFocus={true}
          multiline={true}
          underlineColorAndroid='transparent'
        />
      </View>
    )
  }
  _editEvaluateFinish() {
    this.props.editFinish(this.state.value);
    this.props.navigator.pop();
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },

  inputText: {
    margin: 10,
  }

});
