/**
 * 查看项目信息页面
 */

import React, {
  AppRegistry,
  Component,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  WebView,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  Linking,
  ProgressBarAndroid,
  InteractionManager,
} from 'react-native';

import Device from '../common/Device';
import NavigationBar from '../common/NavigationBar';
import GlobalColor from '../common/GlobalColor';
import Network from '../common/Network';
import BasePage from './BasePage';

export default class ProjectInfo extends BasePage {
  constructor(props) {
    super(props);
    this.state = {
      defaultBriefLines: 2,
      sketchText:'展开🔽',
      isLoadedData: false,
      data: undefined,
    };

    //绑定方法
    this._toggleText = this._toggleText.bind(this);
  }

  fetchData() {
    Network.get("projectinfo", {projectId: this.props.projectId}, (response) => {
      this.setState({
        isLoadedData: true,
        data: response.result
      });
    },
    (err) => {
      ToastAndroid(err.toString(), ToastAndroid.SHORT);
    });
  }

  renderContentView() {
    var data = this.state.data;
    return(
      <ScrollView contentContainerStyle = {styles.container}>
        <View style = {styles.list}>
          <Text style={styles.textLeft}>项目名称</Text>
          <Text style={styles.textCenter}>：</Text>
          <Text style={styles.textRight}>{data.projectName}</Text>
        </View>
        <View style = {styles.list}>
          <Text style={styles.textLeft}>对方当事人</Text>
          <Text style={styles.textCenter}>：</Text>
          <Text style={styles.textRight}>{data.opposite}</Text>
        </View>
        <View style = {styles.list}>
          <Text style={styles.textLeft}>第三方</Text>
          <Text style={styles.textCenter}>：</Text>
          <Text style={styles.textRight}>{data.third}</Text>
        </View>
        <View style = {styles.list}>
          <Text style={styles.textLeft}>标的额</Text>
          <Text style={styles.textCenter}>：</Text>
          <Text style={styles.textRight}>{data.money}</Text>
        </View>
        <View style={styles.line}>
        </View>

        <View style = {styles.list}>
          <View style = {styles.lawyerList}>
            <Text style={styles.textLeft}>客户</Text>
            <Text style={styles.textCenter}>：</Text>
            <Text style={styles.textRight}>{data.clientName}</Text>
          </View>
          <TouchableOpacity onPress={this._call.bind(this, data.clientPhone)}>
            <Image style={styles.phonePic} source={require('../../Resources/phone.png')}/>
          </TouchableOpacity>
        </View>

        <View style = {styles.list}>
          <View style = {styles.lawyerList}>
            <Text style={styles.textLeft}>项目经理</Text>
            <Text style={styles.textCenter}>：</Text>
            <Text style={styles.textRight}>{data.managerName}</Text>
          </View>
          <TouchableOpacity onPress={this._call.bind(this, data.managerPhone)}>
            <Image style={styles.phonePic} source={require('../../Resources/phone.png')}/>
          </TouchableOpacity>
        </View>

        <View style={styles.line}>
        </View>
        <View style = {styles.listTwo}>
          <Text style={styles.textLeft}>案件简介</Text>
        </View>

        <Text style={styles.longText}
        numberOfLines = {this.state.defaultBriefLines}
        >
        {data.brief}
        </Text>

        <TouchableOpacity
          onPress={this._toggleText}
        >
          <Text style={styles.sketchBtn}
          >
          {this.state.sketchText}
          </Text>
        </TouchableOpacity>

        <View style={styles.line}>
        </View>

        <View style={styles.lastView}>
          <Text style={styles.goal}>
            客户目标
          </Text>
          <Text style={styles.goalContent}>
          {data.goals}
          </Text>
        </View>

      </ScrollView>
      );
  }

  //控制案情简介的展开与收起
  _toggleText() {
    if(this.state.defaultBriefLines === 2)
    {
      this.setState({
        defaultBriefLines: 100,
        sketchText: '收起🔼',
      });
    }
    else if (this.state.defaultBriefLines === 100) {
      this.setState({
        defaultBriefLines: 2,
        sketchText: '展开🔽',
      });
    }
  }
  //打电话
  _call(num) {
    var url = 'tel:' + num;
    Linking.canOpenURL(url).then(supported => {
      if(supported) {
        Linking.openURL(url);
      }
      else {
        ToastAndroid.show('此设备不支持电话拨打', ToastAndroid.SHORT);
      }
    })
  }
};


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    justifyContent: 'flex-start',
  },
  list: {
    // flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  textLeft: {
    marginLeft:20,
    width:80,
  },
  phonePic: {
    // height:20,
  },
  line: {
    height:1,
    backgroundColor:'#ddd',
    marginTop: 20,
  },
  listTwo: {
    flexDirection: 'row',
    marginTop: 20,
    height: 30,
  },
  longText: {
    marginLeft:20,
    marginRight:20,
    color:'#666',
  },
  sketchBtn: {
    color: '#16648B',
    marginLeft:20,
    marginTop:20,

  },
  lastView: {
    marginTop:20,
    marginLeft:20,
  },
  goal: {
    marginBottom:20,
  },
  goalContent:{
    color:'#666',
    marginBottom: 20,
  },
  lawyerList:{
    flexDirection: 'row',
    width: Device.scrrenWidth - 50,
  }
});
