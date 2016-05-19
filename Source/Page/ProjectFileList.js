/**
 * 文件列表，由项目进程页面进入
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
   ToastAndroid
 } from 'react-native';

 import BasePage from './BasePage';
 import GlobalColor from '../common/GlobalColor';
 import Network from '../common/Network';
 import ProjectFileInfoCell from '../ViewsComponent/ProjectFileInfoCell';
 import FilePreview from './FilePreview';

 export default class ProjectFileList extends BasePage {
     constructor(props) {
       super(props);
       this.state = {
         isLoadedData: false,
         fileInfoDataSource: new ListView.DataSource({
           rowHasChanged: (r1, r2) => r1 !== r2,
         }),
       };
     }

     //加载待办事项的数据
     fetchData() {
         var params = {projectId: this.props.projectId, type: this.props.data.type};
         Network.get('projectFile',
         params,
         (response) => {
             if(response.result.length === 0) {
                 this.setState({
                     isLoadedData: true,
                 });
                 return;
             }
             this.setState({
                 isLoadedData: true,
                 fileInfoDataSource: this.state.fileInfoDataSource.cloneWithRows(response.result),
             });
         },
         (err) => {
             ToastAndroid.show(err, ToastAndroid.SHORT);
             this.setState({
                 isLoadedData: true,
             });
         });
     }

     renderContentView() {
       return (
         <ListView
           style={styles.listView}
           contentContainerStyle={styles.listContent}
           dataSource={this.state.fileInfoDataSource}
           renderRow={this._renderProjectFileInfoCell.bind(this)}
           renderSeparator={this._renderSeparator.bind(this)}
         />
       );
     }

     //文件信息的cell
     _renderProjectFileInfoCell(rowData, sectionID, rowID) {
       return (
         <ProjectFileInfoCell data={rowData} onPress={()=> {
           //进入文件预览页面
           this.props.navigator.push({
             title: rowData.name,
             component: FilePreview,
             passProps: {
               data: rowData
             },
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

 };

 const styles = StyleSheet.create({
     //线的样式
     line: {
       height: 1,
       backgroundColor: GlobalColor.lineColor,
     },
 });
