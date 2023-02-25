import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
} from 'react-native';

import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {DocumentDirectoryPath} from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

var record = require('../assets/img/record.png');
var closeIcon = require('../assets/img/close.png');
var stopIcon = require('../assets/img/stop.png');
var playIcon = require('../assets/img/play.png');
var pauseIcon = require('../assets/img/pause.png');
export default class RecordComponent extends Component {
  constructor(props) {
    super(props);
    global.array = [];
    global.audio = '';
    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: '00:00:00',
      currentDurationSec: '00:00:00',
      playTime: '00:00:00',
      duration: '00:00:00',
      showPlayView: false,
      showPlayPause: false,
      count: 0,
      voiceRecords: '',
      voiceArray: [],
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }

  onStartRecord = async () => {
    console.log(this.state.count);
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the Audio');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    const path = Platform.select({
      ios: `audio ${this.state.count}.m4a`,
      android: `${DocumentDirectoryPath}/audio${Math.floor(
        Math.random() * 10,
      )}.mp4`,
    });
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    console.log('audioSet', audioSet);
    const uri = await this.audioRecorderPlayer.startRecorder(path, audioSet);
    this.audioRecorderPlayer.addRecordBackListener((e: any) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
        showPlayView: false,
        showPlayPause: true,
      });
    });
    console.log(uri, 'uri');
  };

  onStopRecord = async () => {
    try {
      const result = await this.audioRecorderPlayer.stopRecorder();
      this.audioRecorderPlayer.removeRecordBackListener();
      this.setState({
        recordSecs: 0,
        showPlayView: true,
      });
      console.log(result, 'onStopRecord');
    } catch (error) {
      console.log(error);
    }
  };

  onPauseRecord = async () => {
    try {
      const result = await this.audioRecorderPlayer.pauseRecorder();
      console.log(result, 'onPauseRecord');
    } catch (error) {
      console.log(error);
    }
  };

  onStartPlay = async e => {
    this.setState({
      count: Math.random() * 100,
    });
    console.log('onStartPlay');
    const path = Platform.select({
      ios: `audio ${this.state.count}.m4a`,
      android: `${DocumentDirectoryPath}/audio${Math.floor(
        Math.random() * 10,
      )}.mp4`,
    });
    const msg = await this.audioRecorderPlayer.startPlayer(path);

    this.audioRecorderPlayer.setVolume(1.0);
    this.audioRecorderPlayer.addPlayBackListener(e => {
      if (e.current_position === e.duration) {
        console.log('finished');
        this.audioRecorderPlayer.stopPlayer();
      }
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
    });
    this.setState({
      voiceRecords: msg,
    });
    this.props?.callBackfn(msg);
  };

  onPausePlay = async e => {
    await this.audioRecorderPlayer.pausePlayer();
  };

  onStopPlay = async e => {
    try {
      await this.audioRecorderPlayer.stopPlayer();
      this.audioRecorderPlayer.removePlayBackListener();
    } catch (error) {
      console.log(error);
    }
  };

  export = () => {
    const {voiceArray, voiceRecords} = this.state;
    console.log(voiceRecords, 'voiceRecords');
    voiceArray.push({audio: voiceRecords});
    console.log('voiceArray', voiceArray);
    AsyncStorage.setItem('Recordings', JSON.stringify(voiceArray));
    // this.forceUpdate();
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          borderRadius: 20,
        }}>
        <ScrollView>
          <View style={styles.txtView}>
            <Text style={styles.txtStyle}>{this.state.recordTime}</Text>
          </View>
          <View style={styles.middleView}>
            <TouchableOpacity
              style={styles.txtView}
              onPress={() => this.onStartRecord()}>
              <Image source={record} style={{height: 30, width: 30}} />
            </TouchableOpacity>
            {this.state.showPlayPause && (
              <>
                <TouchableOpacity
                  style={styles.txtView}
                  onPress={() => this.onPauseRecord()}>
                  <Image source={pauseIcon} style={styles.img} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stopTxtView}
                  onPress={() => this.onStopRecord()}>
                  <Image source={stopIcon} style={styles.img} />
                </TouchableOpacity>
              </>
            )}
          </View>
          {this.state.showPlayView ? (
            <>
              <View style={styles.txtView}>
                <Text style={styles.txtStyle}>
                  {this.state.playTime} / {this.state.duration}
                </Text>
              </View>
              <View style={styles.middleView}>
                <TouchableOpacity
                  style={styles.txtView}
                  onPress={() => this.onStartPlay()}>
                  <Image source={playIcon} style={styles.img} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.txtView}
                  onPress={() => this.onPausePlay()}>
                  <Image source={pauseIcon} style={styles.img} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stopTxtView}
                  onPress={() => this.onStopPlay()}>
                  <Image source={stopIcon} style={styles.img} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.noRecordView}>
              <Text style={styles.noRecordText}>No Recordings</Text>
            </View>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.exportBtn}
          onPress={() => this.export()}>
          <Text style={styles.exportBtnText}>Export</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txtStyle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  txtView: {
    // paddingHorizontal: 5,
    // paddingVertical: 16,
    // marginVertical: 10,
    // marginLeft: 'auto',
    // marginRight: 'auto',
  },
  stopTxtView: {
    // paddingHorizontal: 5,
    // paddingVertical: 16,
    // marginVertical: 10,
    // marginLeft: 'auto',
    // marginRight: 'auto',
    backgroundColor: 'red',
    borderRadius: 100,
  },
  img: {
    height: 30,
    width: 30,
    tintColor: '#ffffff',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  middleView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#937DC2',
    margin: 18,
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  noRecordView: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  noRecordText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    // textShadowOffset:{height:1,width:1},
    // textShadowColor:'red',
    // textShadowRadius:20
  },
  exportBtn: {
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 7,
    backgroundColor: '#937DC2',
    marginVertical: 20,
  },
  exportBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
