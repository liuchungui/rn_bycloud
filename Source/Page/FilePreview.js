/**
 * 预览文件页面
 */
import React, {
  View,
  Image,
  TouchableOpacity,
  Text,
  Component,
  StyleSheet,
  WebView,
  Linking,
  ToastAndroid,
} from 'react-native';

import Button from '../common/Button';
import Util from '../common/Util';
import Progress from 'react-native-progress';
import GlobalColor from '../common/GlobalColor';
import Downloader from '../common/Downloader';
import NavigationBar from '../common/NavigationBar';
import * as WeChat from 'react-native-wechat';
import RNFS from 'react-native-fs';
import Intent from 'react-native-android-intent';
import {
    WXAppKey
} from '../common/GlobalConst';

export default class FilePreview extends Component {
  constructor(props) {
    super(props);
    //注册微信账号
    WeChat.registerApp(WXAppKey);
    this._initData = this._initData.bind(this);
    this._initData();
  }

  _initData() {
    //是否正在下载
    this.isLoading = false;
    var data = this.props.data;
    console.log(data);
    console.log("FilePreview:", data.url);
    //对url进行Encoding
    var lastPath = Util.lastPathCompoent(data.url);
    var deletingLastPath = Util.deletingLastPathCompoent(data.url);
    var url = deletingLastPath + '/' + encodeURI(lastPath);
    //下载存储的文件路径
    var filePath = RNFS.ExternalDirectoryPath + '/' + data.name;

    this.state = {
      progress: 0,
      isLoaedFile: false,
      contentLength: 0,
      data: data,
      downloadUrl: url,
      filePath: filePath,
    };
  }
  render() {
    var renderContent = null;
    if(this.state.isLoaedFile) {
      return this._renderLoaedFileView();
    }
    else {
      return this._renderNotLoaedFileView();
    }
  }

  _renderNotLoaedFileView() {
    //查找后缀
    var fileExtension = Util.pathExtension(this.state.data.name);
    return (
      <View style={styles.container}>
        <NavigationBar
          navigator={this.props.navigator}
          backgroundColor={GlobalColor.mainColor}
          title={this.props.title}
        />
        <View style={styles.innerContainer}>
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={this._pressDownloadFile.bind(this)}
        >
        {fileExtension}
        </Button>
        <Text style={styles.fileName}>{this.state.data.name}</Text>
        <Progress.Bar progress={this.state.progress} width={200} />
        <Text style={styles.tipText} onPress={this._pressDownloadFile.bind(this)}>请点击下载</Text>
        </View>
      </View>
    );
  }

  _renderLoaedFileView() {
    var fileExtension = Util.pathExtension(this.state.data.name);
    return (
      <View style={styles.container}>
        <NavigationBar
          navigator={this.props.navigator}
          backgroundColor={GlobalColor.mainColor}
          title={this.props.title}
          rightIcon={require('../../Resources/share_icon.png')}
          pressRightButton={this._shareFile.bind(this)}
        />
        <View style={styles.innerContainer}>
          <Button
            style={styles.button}
            textStyle={styles.buttonText}
            disabled={true}
          >
            {fileExtension}
          </Button>
          <Text style={styles.fileName}>{this.state.data.name}</Text>
          <Button
            style={styles.openButton}
            textStyle={styles.buttonText}
            onPress={this._pressOpenFile.bind(this)}
          >
            用其它应用打开
          </Button>
        </View>
      </View>
    );
  }

  _pressDownloadFile() {
    if(this.isLoading) {
      return;
    }
    this.isLoading = true;
    //检查文件是否已经下载
    RNFS.exists(this.state.filePath)
    .then(result => {
      if(result) {
        this.isLoading = false;
        this.setState({
          progress: 1,
          isLoaedFile: true,
        });
      }
      else {
        RNFS.downloadFile(this.state.downloadUrl, this.state.filePath, (res) => {
          this.setState({
            contentLength: res.contentLength
          });
        },
        data => {
          this.setState({
            progress: data.bytesWritten/this.state.contentLength,
          });
        })
        .then(res => {
          this.isLoading = false;
          console.log(res);
          this.setState({
            progress: res.bytesWritten/this.state.contentLength,
            isLoaedFile: true,
          });
        })
        .catch(err => {
          ToastAndroid.show('下载文件失败', ToastAndroid.SHORT);
          this.isLoading = false;
        });
      }
    })
    .catch(err => {
      ToastAndroid.show('下载文件失败', ToastAndroid.SHORT);
      this.isLoading = false;
    });
  }

  _pressOpenFile() {
    console.log("filePath:", this.state.filePath);
    Intent.open(this.state.filePath, isOpen => {
      if(isOpen) {
      }
      else {
        ToastAndroid.show('未检测到可以打开的应用', ToastAndroid.SHORT);
      }
    });
  }

  _shareFile() {
    try {
      var result = WeChat.shareToSession({
        type: 'file',
        title: Util.lastPathCompoent(this.state.filePath),
        description: '文件分享',
        mediaTagName: 'word file',
        messageAction: undefined,
        messageExt: undefined,
        filePath: this.state.filePath,
        fileExtension: Util.pathExtension(this.state.filePath),
      });
    }
    catch(e) {
      ToastAndroid.show('分享失败', ToastAndroid.SHORT);
    }
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
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 5.0,
    backgroundColor: GlobalColor.mainColor,
  },
  openButton: {
    width: 200,
    height: 40,
    borderRadius: 5.0,
    backgroundColor: 'rgb(100,200,100)',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  fileName: {
    fontSize: 16.0,
    color: 'rgb(40, 40, 40)',
    margin: 10,
  },
  tipText: {
    color: GlobalColor.mainColor,
    fontSize: 14,
    margin: 10,
    width: 200,
    height: 50,
    textAlign: 'center',
  },
});
