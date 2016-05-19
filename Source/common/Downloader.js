'use strict';
import React, {
  PropTypes
} from 'react-native';
export default class Downloader {
  request: XMLHttpRequest;
  canceled: boolean;
  progress: number;
  url: string;
  contentLength: number;

  constructor(url) {
    this.url = url;
    this.canceled = false;
    console.log(url);
  }

  start(progressCallback: func, failCallback: func, successCallback: func) {
    this.request && this.request.abort();

    var request = this.request || new XMLHttpRequest();
    request.onreadystatechange = () => {
      console.log(request.readyState);
      if(request.readyState === request.HEADERS_RECEIVED) {
        this.contentLength = parseInt(request.getResponseHeader('Content-Length'), 10);
        console.log(this.contentLength);
      }
      else if(request.readyState === request.LOADING) {
        console.log(request.response);
        progressCallback(request.responseText.length/this.contentLength);
      }
      else if(request.readyState === request.DONE) {
        if(this.canceled) {
          this.canceled = false;
          return;
        }
        console.log(request);
        console.log("finish");
        if(request.status === 200) {
          console.log("successCallback");
          successCallback(request.responseText);
        }
        else if(request.status !== 0) {
          failCallback('Error: Server returned HTTP status of' + request.status + ' ' + request.responseText);
        }
        else {
          failCallback('Error: ' + request.responseText);
        }
      }
    }
    //请求
    request.open('GET', this.url);
    //Avoid gzip so we can actually show progress
    request.setRequestHeader('Accept-Encoding', '');
    request.send();
    this.request = request;
  }
}
