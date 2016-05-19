'use strict'
import React, {
  ListView,
  View,
  Text,
  StyleSheet,
  ProgressBarAndroid,
  Navigator,
  TouchableOpacity,
} from 'react-native';

import BasePage from './BasePage';
import ProjectProgress from './ProjectProgress';
import Account from './Account';
import HomeListCell from '../ViewsComponent/HomeListCell';
import GlobalColor from '../common/GlobalColor';
import Network from '../common/Network';
import BGGlobal from '../common/BGGlobal';

export default class HomeList extends BasePage {
  constructor(props) {
    super(props);

    var getRowData = (dataArray, sectionID, rowID) => {
      console.log(dataArray[sectionID][rowID]);
      return dataArray[sectionID][rowID];
    };

    this.state = {
      dataSource: new ListView.DataSource({
        getRowData: getRowData,
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
      isLoadedData: false,
      dataArray: [],
    };
  }

  renderContentView() {
    return (
      <ListView
        style={styles.listView}
        contentContainerStyle={styles.listViewContent}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        renderSeparator={this._renderSeparator}
        renderSectionHeader={this._renderSectionHeader}
      />
    );
  }

  /**
   * 请求数据，父类中的componentDidMount默认会调用
   */
  fetchData() {
    Network.get('allprojects', {userId: BGGlobal.userInfo.userId},
    responseData => {
      var dataArray = this.state.dataArray;
      if(responseData.result.planProjects.length > 0) {
        dataArray.push(responseData.result.planProjects);
      }
      if(responseData.result.finishProjects.length > 0) {
        dataArray.push(responseData.result.finishProjects);
      }
      this.setState({
        dataArray: dataArray,
        isLoadedData: true,
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataArray),
      });
    },
    err => {
      console.log(err);
    });
  }

  navigationBarConfInfo() {
    return {
      isShowBack: false,
      rightIcon: require('../../Resources/avatar.png'),
      rightButtonPress: this._pressRightButton.bind(this)
    };
  }

  /**
   * 渲染每一行
   */
  _renderRow(rowData, sectionID, rowID) {
    return (
      <HomeListCell data={rowData} onPress={this._onPressHomeListCell.bind(this, rowData, sectionID, rowID)} />
    );
  }

  /**
   * 渲染每一组的头
   */
  _renderSectionHeader(sectionData, sectionID) {
    var headerText;
    switch (sectionID) {
      case "0":
      headerText = "正在进行的项目";
        break;
      case "1":
      headerText = "已经完成的项目";
        break;
      default:
      headerText = "错了，有问题";
      break;
    }
    return (
      <View key={sectionID} style={styles.sectionHeader}>
        <Text style={styles.headerText}>{headerText}</Text>
        <View style={styles.line} />
      </View>
    );
  }

  /**
   * 渲染分割线
   */
  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={sectionID+rowID} style={styles.line}/>
    );
  }

  //点击首页每一行cell触发事件
  _onPressHomeListCell(rowData, sectionID, rowID) {
    this.props.navigator.push({
      title: rowData.projectName,
      component: ProjectProgress,
      passProps: {
        projectId: rowData.projectId,
      }
    });
  }

  //点击右上角的Icon触发事件
  _pressRightButton() {
    this.props.navigator.push({
      title: '个人中心',
      id: 'Account',
      component: Account,
      passProps: {
        isShowLoadingProgress: false,
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
  },
  //列表的样式
  listView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#E0E0E0',
  },
  //加载视图的布局
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  //线的样式
  line: {
    height: 1,
    backgroundColor: '#D9D9D9',
  },
  sectionHeader: {
    flex: 1,
    height: 35,
    flexDirection: 'column',
  },
  headerText: {
    flex: 1,
    // backgroundColor: 'blue',
    textAlign: 'center',
    //临时解决的办法
    marginTop: 8,
  },
});
