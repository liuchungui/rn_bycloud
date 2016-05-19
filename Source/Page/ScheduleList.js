/**
 * 事项列表
 */
'use strict';
import React, {
  View,
  Image,
  Text,
  Component,
  StyleSheet,
  TouchableOpacity,
  ListView,
  ToastAndroid,
  Alert,
} from 'react-native';

import BasePage from './BasePage';
import GlobalColor from '../common/GlobalColor';
import Network from '../common/Network';
import ScheduleCell from '../ViewsComponent/ScheduleCell';
import ScheduleSectionHeader from '../ViewsComponent/ScheduleSectionHeader';
import ScheduleDetail from './ScheduleDetail';
import BGGlobal from '../common/BGGlobal';

export default class ScheduleList extends BasePage {
    constructor(props) {
        super(props);
        var getRowData = (dataArr, sectionID, rowID) => {
            return dataArr[sectionID][rowID];
        };
        this.state = {
            dataArray: [],
            isLoadedData: false,
            scheduleDataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => {
                  //当点击完成，刷新时，标记每一行都变化
                  return true;
                },
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
                getRowData: getRowData,
            }),
        };

        //绑定方法
        this._finishAndReload = this._finishAndReload.bind(this);
    }

    //加载待办事项的数据
    fetchData() {

        Network.get('scheduleProject',
        {pmid: this.props.pmid},
        (response) => {
            var dataArray = [];
            var tmpArray = Array.prototype.slice.call(response.result.backlog);
            if(tmpArray.length > 0) {
              dataArray['backlog'] = tmpArray;
            }
            tmpArray = Array.prototype.slice.call(response.result.finish);
            if(tmpArray.length > 0) {
              dataArray['finish'] = tmpArray;
            }
            this.setState({
                dataArray: dataArray,
                isLoadedData: true,
                scheduleDataSource: this.state.scheduleDataSource.cloneWithRowsAndSections(dataArray),
            });
        },
        (err) => {
            // console.log(err);
            // ToastAndroid.show(String(err), ToastAndroid.SHORT);
        });
    }

    renderContentView() {
      return (
        <ListView
          style={styles.listView}
          contentContainerStyle={styles.listContent}
          dataSource={this.state.scheduleDataSource}
          renderRow={this._renderScheduleCell.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
          renderSectionHeader={this._renderScheduleSectionHeader.bind(this)}
        />
      );
    }

    _renderScheduleSectionHeader(sectionData, sectionID) {
        var text = "未完成";
        var color = "black"
        switch (sectionID) {
            case "backlog":
                text = "未完成";
                color = GlobalColor.mainColor;
                break;
            case "finish":
                text = "已完成";
                color = 'rgb(60, 60, 60)';
                break;
            default: text = "未知";
        }
        return (
            <ScheduleSectionHeader textStyle={{color: color}}>{text}</ScheduleSectionHeader>
        );
    }

    //代码事项的cell
    _renderScheduleCell(rowData, sectionID, rowID) {
        return (
            <ScheduleCell
            data={rowData}
            onPress={() => {
                this.props.navigator.push({
                    title: '待办事项详情',
                    component: ScheduleDetail,
                    passProps: {
                        data: rowData,
                        projectId: this.props.projectId,
                        submitFinishFunc: () => {
                            //删除元素，重新刷新
                            this._finishAndReload(sectionID, rowID);
                        }
                    }
                });
            }}
            didClikBox={() => {
                if(rowData.status == 2) {
                    return;
                }
                Alert.alert('确定已完成事项？', null, [
                    {text: '取消', onPress: () => {
                    }},
                    {},
                    {text: '确定', onPress: () => {
                        var params = {
                            pmiId: rowData.pmiId,
                            pmId: rowData.pmId,
                            detail: rowData.detail,
                            moduleId: rowData.moduleId,
                            projectId: this.props.projectId,
                            userId: BGGlobal.userInfo.userId,
                        };
                        Network.post('submitFinish', params, response => {
                            //删除元素，重新刷新
                            this._finishAndReload(sectionID, rowID);
                        },
                        err => {
                            ToastAndroid.show('提交完成失败', ToastAndroid.SHORT);
                        });
                    }}
                ]);
            }}
            />
        );
    }

    _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View key={sectionID+rowID} style={styles.line}/>
        );
    }

    _renderFooter() {
        return (
            <View style={styles.line}/>
        );
    }

    //完成并刷新
    async _finishAndReload(sectionID, rowID) {
        var dataArray = this.state.dataArray;
        var sectionDataArray = dataArray[sectionID];
        //删除
        var item = sectionDataArray.splice(rowID, 1)[0];
        item.status = 2;
        //插入
        var finishArray = dataArray['finish'];
        if(finishArray == undefined) {
          finishArray = new Array();
          dataArray['finish'] = finishArray;
        }
        finishArray.splice(0, 0, item);

        console.log(item);
        console.log(finishArray);
        console.log(dataArray);

        //刷新
        await this.setState({
            dataArray: dataArray,
            isLoadedData: true,
            scheduleDataSource: this.state.scheduleDataSource.cloneWithRowsAndSections(dataArray),
        });
    }
};

const styles = StyleSheet.create({
    //线的样式
    line: {
      height: 1,
      backgroundColor: GlobalColor.lineColor,
    },
});
