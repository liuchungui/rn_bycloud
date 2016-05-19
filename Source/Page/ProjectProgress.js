/*
*详情页面
*
*/
import React, {
  StyleSheet,
  Text,
  View,
  ListView,
  ProgressBarAndroid,
  ToastAndroid,
  Alert,
  InteractionManager,
} from 'react-native';

import Network from '../common/Network';
import GlobalColor from '../common/GlobalColor';
import Button from '../common/Button';
import NavigationBar from '../common/NavigationBar';
import SegmentView from '../ViewsComponent/SegmentView';
import ProjectStageCell from '../ViewsComponent/ProjectStageCell';
import ProjectStateTitleCell from '../ViewsComponent/ProjectStateTitleCell';
import ProjectStateContentCell from '../ViewsComponent/ProjectStateContentCell';
import ScheduleModuleCell from '../ViewsComponent/ScheduleModuleCell';
import ScheduleSectionHeader from '../ViewsComponent/ScheduleSectionHeader';
import Evaluate from './Evaluate';
import BGGlobal from '../common/BGGlobal';
import ProjectInfo from './ProjectInfo';
import BasePage from './BasePage';
import ScheduleList from './ScheduleList';
import ProjectFileList from './ProjectFileList';

export default class ProjectProgress extends BasePage {
  constructor(props) {
    super(props);
    var getRowData = (dataArr, sectionID, rowID) => {
      return dataArr[sectionID][rowID];
    };
    var selectIndex = 0;
    if(this.props.selectIndex !== undefined) {
      selectIndex = this.props.selectIndex;
    }
    this.state = {
      isLoadedData: false,
      progressDataArray: [],
      selectIndex: selectIndex,
      title: this.props.title,
      progressDataSource: new ListView.DataSource({
        getRowData: getRowData,
        rowHasChanged: (r1, r2) => {
          if(r1 !== r2) {
            return true;
          }
          if(r1.level == 1) {
            return true;
          }
          return false;
        },
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
      fileInfoDataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      scheduleDataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        getRowData: getRowData,
      }),
    };
  }

  render() {
    var content = null;
    if(this.state.isLoadedData) {
      content = this.renderContentView();
    }
    else {
      content = this.renderLoadingView();
    }
    return (
      <View style={styles.container}>
        <NavigationBar
          navigator={this.props.navigator}
          backgroundColor={GlobalColor.mainColor}
          title={this.state.title}
        />
        <View style={{flex: 1}}>
          <Button
            onPress={this._clikTopButton.bind(this)}
            imageSource={require('../../Resources/arrow_left.png')}
            style={styles.topButton}
            textStyle={styles.topButtonText}
          >
            查看项目信息
          </Button>
          <SegmentView
            items={['事项', '文件', '进程']}
            didSelectIndexFunc={this._segmentViewSelectIndex.bind(this)}
            selectIndex={this.props.selectIndex}
          />
          {content}
        </View>

      </View>
    );
  }

  renderContentView() {
      var dataSource;
      var renderRow;
      var renderSeparator;
      var renderSectionHeader;
      var contentStyle;
      switch (this.state.selectIndex.toString()) {
          case '0':
              dataSource = this.state.scheduleDataSource;
              renderRow = this._renderScheduleCell.bind(this);
              renderSeparator = this._renderSeparator.bind(this);
              contentStyle = {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
              };
              break;
          case '1':
              dataSource = this.state.fileInfoDataSource;
              renderRow = this._renderProjectFileInfoCell.bind(this);
              renderSeparator = this._renderSeparator.bind(this);
              renderSectionHeader = null;
              contentStyle = {flexDirection: 'column'};
              break;
          case '2':
              dataSource = this.state.progressDataSource;
              renderRow = this._renderProgressProjectCell.bind(this);
              renderSeparator = null;
              renderSectionHeader = null;
              contentStyle = {flexDirection: 'column'};
              break;
          default:
      }
      return (
          <ListView
              style={styles.listView}
              contentContainerStyle={contentStyle}
              dataSource={dataSource}
              renderRow={renderRow}
              renderSeparator={renderSeparator}
              renderSectionHeader={renderSectionHeader}
          />
      );
  }

  //渲染项目进度的cell
  _renderProgressProjectCell(rowData, sectionID, rowID) {
    if(rowID == 0) {
      var isShowBottomLine = false;
      var isShowTopLine = false;
      if(sectionID == 0) {
          isShowBottomLine = true;
      }
      else if(sectionID == this.state.progressDataArray.length - 1) {
          isShowTopLine = true;
      }
      else {
          isShowBottomLine = true;
          isShowTopLine = true;
      }
      return (
        <ProjectStageCell
          title={rowData.title}
          status={rowData.status}
          showBottomLine={isShowBottomLine}
          showTopLine={isShowTopLine}
          isExpand={false}
          didExpand={(isExpand) => {
            //点击是否展开
            if(isExpand) {
              this._didExpandSection(sectionID);
            }
            else {
              this._didCloseSection(sectionID);
            }
          }}
        />
      );
    }
    else {
      if(rowData.level == 1) {
        return (
          <ProjectStateTitleCell data={rowData} onPress={this._pushEvaluatePage.bind(this, rowData, sectionID, rowID)}/>
        );
      }
      else {
        return (
          <ProjectStateContentCell
            time={rowData.time}
            title={rowData.userName}
            content={rowData.content}
          />
        );
      }
    }
  }

  //文件信息的cell
  _renderProjectFileInfoCell(rowData, sectionID, rowID) {
    return (
        <Button
            imageStart={true}
            style={styles.projectFileCellStyle}
            imageStyle={styles.projectFileImageStyle}
            textStyle={styles.projectFileTextStyle}
            imageSource={require('../../Resources/file_icon.png')}
            onPress={() => {
                //进入文件预览页面
                this.props.navigator.push({
                  title: rowData.title,
                  component: ProjectFileList,
                  passProps: {
                    data: rowData,
                    projectId: this.props.projectId,
                  },
                });
            }}
        >
            {rowData.title}
        </Button>
    );
  }

  //代码事项的cell
  _renderScheduleCell(rowData, sectionID, rowID) {
      console.log(rowData);
      return (
          <ScheduleModuleCell
              data={rowData}
              onPress={() => {
                  this.props.navigator.push({
                      title: rowData.moduleName,
                      component: ScheduleList,
                      passProps: {
                          pmid: rowData.pmid,
                          projectId: this.props.projectId,
                      }
                  });
              }}
          />
      );
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={sectionID+rowID} style={styles.line}/>
    );
  }

  //关闭某一组
  _didCloseSection(section) {
    var dataArray = this.state.progressDataArray;
    dataArray[section][0].isExpand = false;
    this._reloadProgressListView(dataArray);
  }

  //展开某一组
  _didExpandSection(section) {
    var dataArray = this.state.progressDataArray;
    dataArray[section][0].isExpand = true;
    this._reloadProgressListView(dataArray);
  }

  //处理项目进程的数据
  _handOnProjectProgressData(dataArray) {
    //整理数据，将records中list数据取出来
    var resultArray = [];
    for (var i = 0; i < dataArray.length; i++) {
      var tmpArray = [];
      //是否展开
      if(dataArray[i].status == 1) {
        dataArray[i].isExpand = true;
      }
      else {
        dataArray[i].isExpand = false;
      }
      tmpArray.push(dataArray[i]);
      for(var j = 0; j < dataArray[i].records.length; j++) {
        var superObject = dataArray[i].records[j];
        for(var k = 0; k < superObject.list.length; k++) {
          var object = superObject.list[k];
          object.needEvaluate = superObject.needEvaluate;
          tmpArray.push(object);
        }
      }
      resultArray.push(tmpArray);
    }
    return resultArray;
  }

  //获取显示的数据
  _getShowDataArray(resultArray) {
    var showDataArray = [];
    for(var i = 0; i < resultArray.length; i++) {
      if(resultArray[i][0].isExpand) {
        showDataArray.push(resultArray[i]);
      }
      else {
        showDataArray.push([resultArray[i][0]]);
      }
    }
    return showDataArray;
  }

  //请求数据
  fetchData() {
    //如果没有标题，则请求项目信息接口获取标题
    if(this.state.title.length === 0) {
      this._fetchProjectInfo();
    }
    switch (this.state.selectIndex.toString()) {
      case '0': this._fetchScheduleData(); break;
      case '1': this._fetchProjectFileInfoData(); break;
      case '2': this._fetchProjectProgressData(); break;
    }
  }

  //获取项目信息
  _fetchProjectInfo() {
    Network.get("projectinfo", {projectId: this.props.projectId}, (response) => {
      this.setState({
        title: response.result.projectName
      });
    },
    (err) => {
    });
  }

  //加载项目进程的数据
  _fetchProjectProgressData() {
      var params = {
          projectId: this.props.projectId,
          userId: BGGlobal.userInfo.userId
      };
      Network.get('projectProgress',
      params,
      (response) => {
          console.log(response);
          var dataArray = response['result'];
          var resultArray = this._handOnProjectProgressData(dataArray);
          this._reloadProgressListView(resultArray);
      },
      (err) => {
          console.log(err);
          ToastAndroid.show('有错误！', ToastAndroid.SHORT);
      });
  }

  //加载项目文件的数据
  _fetchProjectFileInfoData() {
      Network.get('projectFileType',
      {},
      (response) => {
          this._reloadProjectFileInfoListView(response['result']);
      },
      (err) => {
          alert(err);
          ToastAndroid.show('有错误！', ToastAndroid.SHORT);
      });
  }

  //加载待办事项模块的数据
  _fetchScheduleData() {
      var params = {projectId: this.props.projectId};
      Network.get('projectModules',
      params,
      (response) => {
          this._reloadScheduleListView(response.result);
      },
      (err) => {
          console.log(err);
          ToastAndroid.show('有错误！', ToastAndroid.SHORT);
      });
  }

  //刷新项目进程的列表
  _reloadProgressListView(resultArray) {
      var cloneDataSource = this.state.progressDataSource.cloneWithRowsAndSections(this._getShowDataArray(resultArray));
      this.setState({
          progressDataArray: resultArray,
          isLoadedData: true,
          progressDataSource: cloneDataSource,
      });
  }

  //刷新文件信息的列表
  _reloadProjectFileInfoListView(resultArray) {
      this.setState({
          isLoadedData: true,
          fileInfoDataSource: this.state.fileInfoDataSource.cloneWithRows(resultArray),
      });
  }

  //刷新待办事项的列表
  _reloadScheduleListView(resultArray) {
      console.log(resultArray);
      this.setState({
          isLoadedData: true,
          scheduleDataSource: this.state.scheduleDataSource.cloneWithRows(resultArray),
      });
  }

  //顶部的SegmentView选择的索引
  _segmentViewSelectIndex(index) {
    this.setState({
      isLoadedData: false,
      selectIndex: index,
    });
    this.fetchData();
  }

  //进入评论页面
  _pushEvaluatePage(data, sectionID, rowID) {
    var evaluateSuccessFunc = () => {
      var progressDataArray = this.state.progressDataArray;
      progressDataArray[sectionID][rowID].needEvaluate = false;
      this._reloadProgressListView(progressDataArray);
    };
    this.props.navigator.push({
      component: Evaluate,
      title: '评论',
      passProps: {
        projectId: this.props.projectId,
        moduleId: data.moduleId,
        progressName: data.content,
        pmid: data.pmid,
        evaluateSuccess: evaluateSuccessFunc,
      }
    });
  }

  //顶部按钮的点击方法，进入查看项目信息
  _clikTopButton() {
    this.props.navigator.push({
      component: ProjectInfo,
      title: '项目基本信息',
      passProps: {
        projectId: this.props.projectId,
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
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    //顶部的按钮样式
    topButton: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 20,
    },
    topButtonText: {
        fontSize: 14,
        color: GlobalColor.mainColor,
    },
    //列表的样式
    listView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
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
        backgroundColor: GlobalColor.lineColor,
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
    projectFileCellStyle: {
        justifyContent: 'flex-start',
    },
    projectFileTextStyle: {
        color: 'rgb(60, 60, 60)'
    },
    projectFileImageStyle: {
        margin: 20,
        height: 45,
        width: 45,
    },
});
