/**
 * 评价页面
 */
'use strict';
import React, {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ProgressBarAndroid,
  PropTypes,
  ToastAndroid,
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import GlobalColor from '../common/GlobalColor';
import StarRating from 'react-native-rating-star';
import Network from '../common/Network';
import Device from '../common/Device';
import EditEvaluate from './EditEvaluate';
import BGGlobal from '../common/BGGlobal';
import BasePage from './BasePage';

export default class Evaluate extends BasePage {
  static propTypes = {
    //阶段名
    progressName: PropTypes.string,
    evaluateSuccess: PropTypes.func,
    projectId: PropTypes.string,
    moduleId: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoadedData: false,
      data: {},
      lawayerSuggestion: '',
      managerSuggestion: '',
      lawayerScore: 0,
      managerScore: 0,
    };

    this._pushEvaluateEditPage = this._pushEvaluateEditPage.bind(this);
  }

  renderContentView() {
    var data = this.state.data;
    var buttonColorStyle = {};
    if(this.state.managerScore > 0 && this.state.lawayerScore > 0) {
      buttonColorStyle = {backgroundColor: GlobalColor.mainColor};
    }
    else {
      buttonColorStyle = {backgroundColor: GlobalColor.disableTextColor};
    }
    return (
      <ScrollView contentContainerStyle={styles.contentContainr}>
        <Text style={styles.titleText}>
        尊敬的客户：
        </Text>
        <Text style={styles.titleText}>{data.projectName+"已经完成"}<Text style={styles.mainColor}>{this.props.progressName}</Text>的工作</Text>

        <View style={styles.sevaluateContainer}>
          <Text style={styles.contentText}>请对<Text style={styles.mainColor}>{data.lawyerName}</Text>律师现阶段的工作做出评论</Text>
          <StarRating
            maxStars={5}
            rating={0}
            starSize={30}
            interitemSpacing={10}
            selectStar={require('../../Resources/select_star.png')}
            unSelectStar={require('../../Resources/unselect_star.png')}
            valueChanged={rating => {
              this.setState({
                lawayerScore: rating,
              });
            }}
          />
          <TextInput
            value={this.state.lawayerSuggestion}
            placeholder='点击留下宝贵意见'
            placeholderTextColor={GlobalColor.placeholderColor}
            underlineColorAndroid={GlobalColor.lineColor}
            onFocus={() => {
              this._pushEvaluateEditPage(0);
            }}
          />
        </View>

        <View style={styles.sevaluateContainer}>
          <Text style={styles.contentText}>请对<Text style={styles.mainColor}>{data.managerName}</Text>现阶段的工作做出评论</Text>
          <StarRating
            maxStars={5}
            rating={0}
            starSize={30}
            interitemSpacing={10}
            selectStar={require('../../Resources/select_star.png')}
            unSelectStar={require('../../Resources/unselect_star.png')}
            valueChanged={rating => {
              this.setState({
                managerScore: rating,
              });
            }}
          />
          <TextInput
            value={this.state.managerSuggestion}
            placeholder='点击留下宝贵意见'
            placeholderTextColor={GlobalColor.placeholderColor}
            underlineColorAndroid={GlobalColor.lineColor}
            onFocus={() => {
              this._pushEvaluateEditPage(1);
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            this._submitComment();
          }}
          style={[styles.button, buttonColorStyle]}
        >
          <Text style={styles.buttonText}>提交</Text>
        </TouchableOpacity>

      </ScrollView>
    );
  }

  fetchData() {
    Network.get('projectinfo', {'projectId': 21}, (response) => {
      console.log(response);
      this.setState({
        isLoadedData: true,
        data: response.result,
      });
    }, (err) => {
      alert(err);
    });
  }

  //提交评论
  _submitComment() {
    Network.post('comment', {
      projectId: this.props.projectId,
      moduleId: this.props.moduleId,
      clientId: BGGlobal.userInfo.userId,
      lawyerComment: this.state.lawayerSuggestion,
      lawyerStar: this.state.lawayerScore,
      managerComment: this.state.managerSuggestion,
      managerStar: this.state.managerScore,
      pmid: this.props.pmid,
    }, (response) => {
      //评论成功
      this.props.evaluateSuccess();
      this.props.navigator.pop();
    }, (err) => {
      console.log(err);
      //失败
      ToastAndroid.show('评论失败', ToastAndroid.SHORT);
    });
  }

  /**
   * 进入评论编辑页面
   * @param  {number} type 0代表是律师评论，1代表是经理评论
   */
  _pushEvaluateEditPage(type) {
    var editFinishFunc = (content) => {
      if(type === 0) {
        this.setState({
          lawayerSuggestion: content,
        });
      }
      else {
        this.setState({
          managerSuggestion: content
        });
      }
    };
    var value = '';
    if(type === 0) {
      value = this.state.lawayerSuggestion;
    }
    else {
      value = this.state.managerSuggestion;
    }
    this.props.navigator.push({
      component: EditEvaluate,
      title: '请留下宝贵意见',
      passProps: {
        editFinish: editFinishFunc,
        value: value,
      }
    });
  }
};

const styles = StyleSheet.create({
  //整个容器的布局
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  contentContainr: {
    margin: 10,
    // alignItems: 'center',
  },
  //加载视图的布局
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sevaluateContainer: {
    marginTop: 15,
  },
  titleText: {
    fontSize: 16,
    color: 'rgb(30, 30, 30)'
  },
  contentText: {
    fontSize: 14,
    color: 'rgb(60, 60, 60)',
    marginBottom: 10,
  },
  mainColor: {
    color: GlobalColor.mainColor,
  },
  button: {
    height: 40,
    width: 180,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  input: {
    height: 45,
    backgroundColor: 'red',
  },

});
