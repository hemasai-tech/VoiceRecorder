import { View, Text, Touchable, TouchableOpacity, AppState, Image, ImageBackground, StyleSheet, Alert, PermissionsAndroid, ToastAndroid } from 'react-native'
import React, { Component } from 'react'
import RBSheet from "react-native-raw-bottom-sheet";
import AudioRecord from 'react-native-audio-record';
import Sound from 'react-native-sound';
import Permissions from 'react-native-permissions';
import { Buffer } from 'buffer';
import { PLAYER_STATES } from "@freakycoder/react-native-media-controls"

const image = require('../assets/img/Bg.jpg')
const record = require('../assets/img/record.png')
const playIcon = require('../assets/img/play.png')
const stopicon = require('../assets/img/stop.png')
const pauseIcon = require('../assets/img/pause.png')

export default class RecordComponent extends Component {
  sound = null;
  constructor(props) {
    super(props)
    this.state = {
      timerSound: null,
      showCameraPreview: false,
      collapse: false,
      videoOpacity: false,
      //Multiple Post
      pickedImageArr: [],
      //Data
      dataSource: {},
      local_changes_arr: [],
      categories: undefined,
      painting_categories: undefined,
      audio_categories: undefined,
      video_categories: undefined,
      yoga_categories: undefined,
      //Comment Block button
      blockCommentBtn: undefined,

      //Input box
      TextInputContent: '',

      //Multi select
      isLoading: true,
      multiSelectEnabled: false,
      loading: false,
      selectedBlogCategory: 'Main',
      selectedBlogCategoryId: '1',

      //Modals visible
      showFullScreen: false,
      showPaintModalVisible: false,
      isPostListVisible: false,
      attachFile: false,
      isPostToPaintVisible: false,
      editPostVisible: false,
      videoModalVisible: false,
      editPaintModalVisible: false,
      showFullScreenMenu: false,
      //Audio
      audioModalVisible: false,
      audioDuration: 0,
      audioPaused: true,
      audioProgress: 0, //(0-1)
      audioTotalTime: '00:00',
      audioProgressTime: '00:00',

      //Post attachments
      selectedAttach: '',
      pickedImage: null,
      imageData: null,
      imageName: '',
      filePath: '',
      pickedImageUri: null,
      showAttachFile: false,
      file: {},
      
      //Audio details
      addAudioDetailsModal: false,
      audioTitleInput: '',
      audioDescInput: '',
      audioDescInputErr: '',
      audioTitleInputErr: '',
      selectedDetailAudio: '',
      //Document details
      documentTitleInput: '',
      documentDescInput: '',
      addDocumentDetailsModal: false,
      selectedDetailDocument: {},
      documentDescInputErr: '',
      documentTitleInputErr: '',
      //Attach details
      addAttachDetails: false,
      attachTitle: '',
      attachTitleErr: '',
      attachDesc: '',
      attachDescErr: '',
      //Caption
      captionInput: '',
      captionInputErr: '',

      appState: AppState.currentState,
      //Category creation err msg
      catAddErrMsg: '',
      isSinglePostListVisible: false,
      file_size: '',
      display: false,
      imageFileExists: false,
      //Share receive from other apps

      //video

      type: 'back',
      isRecording: false,
      videoVisible: false,
      videoUri: '',
      videoPath: '',
      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
      startVideoDisable: false,
      previewVideoModal: false,

      //Audio recorder
      isAudioRecordModal: false,
      isAudioRecordPermision: false,
      isAudioStoppedRecording: false,
      isAudioRecording: false,
      isAudioCurrentTime: 0.0,
      isAudioRecordFinished: false,
      isAudioFile: '',

      showRecordedAudio: false,

      recorderAudio: '',
      isAudioPreviewModal: false,
      isAudioPath: '',
      isAudioPlaying: false,
      playState: 'paused', //playing, paused
      playSeconds: 0,
      duration: 0,

      searchTerm: '',
      onSearchEnabled: false,

      //Multiple Image
      multipleImageArr: [],
      fileObjArray: [{ postFileName: '' }],
      fileObjArrayLength: 0,
      multipleVideoArr: [],
      showVideoAttachFile: false,
      multipleAudioArr: [],
      showAudioAttachFile: false,
      multipleAudiopath: '',
      showAddDocFile: false,
      multipleDocArr: [],
      replyBottomSheet: false,
      selectedMultiAudioIdx: 0,
      replyArrValue: 'null',
      replyDummyArr: [],
      no_of_replies: 0,
      replyAuthor: '',
      replyContent: '',
      replyIcon: '',
      textReplyContent: '',
      replyPostId: '',
      updateReplies: 0,
      expanded: false,
      viewRelyBottomSheet: false,
      //Reply viewing
      viewReplyContent: '',
      viewReplyAuthor: '',
      viewReplyArray: [],
      viewReplyIcon: '',
      selectedIndex: [],
      multiSelectViewReplyEnabled: false,
      viewRepliesTotal: 0,
      internet: true,
      selectedPaint: {},
      searchCount: 0,
      replyLoading: false,
      audioPlayerTitle: '',
      url: '',
      videocurrentTime: 0,
      videoduration: 0,
      videoisFullScreen: false,
      videopaused: false,
      videoplayerState: PLAYER_STATES.PLAYING,
      selectedVideo: '',
      textModalVisible: false,
      viewMoreText: '',
      loadmoreLoader: false,
      font_size: 0,
      adminNameVisibility: false,
      videoHeight: 0,
      videoWidth: 0,
      Height_Layout: 0,
      Width_Layout: 0,
      fabButton: false,
      scrollPosition: 0,
      postCommentUserName: '',
      postCommentUserNameArray: [],
      postCommentUserId: '',
      postCommentUserImage: '',
      searchScrollPosition: '',
      audiorepeatTimesCounter: 0,
      audiorepeatTimes: null,
      textEditModal: false,
      textEditModalValue: '',
      scrollOffsetPosition: '',
      viewReplyViaNotificationBottomSheet: false,
      viewReplyPostContentType: '',
      webViewVisible: false,
      webUrl: '',
      firstLaunch: null,
    };
  }

  requestAudioPermission = async () => {
    try {
      var checkAudioPermission = PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (checkAudioPermission === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({
          isAudioRecordModal: true,
          attachFile: false,
        });
      } else {
        try {
          var granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: '',
              message:
                'We required Required Audio permission to record the audio ' +
                'Please grant us.',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.setState({
              isAudioRecordModal: true,
              attachFile: false,
            });
          } else {
          }
        } catch (err) { }
      }
    } catch (e) {
      console.log('requestAudioPermission', e);
    }
  };

  setAudioModalVisible(visible) {
    this.onVideoTimeClear();
    this.setState({ isAudioRecordModal: visible });
  }
  setAudioPreviewModalVisible(visible) {
    this.onVideoTimeClear();
    this.setState({ isAudioPreviewModal: visible });
  }

  onVideoTimeClear = () => {
    clearInterval(this.state.timer);
    this.setState({
      timer: null,
      audioTotalTime:
        this.state.minutes_Counter + ':' + this.state.seconds_Counter,
      minutes_Counter: '00',
      seconds_Counter: '00',
      startDisable: false,
    });
  };

  audioRecordStart = async () => {
    console.log('audioRecordStart');
    var options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'audio.wav',
    };

    AudioRecord.init(options);
    try {
      if (this.state.isAudioRecording == true) {
        ToastAndroid.show('Audio already recording', ToastAndroid.show);
      } else {
        this.onVideoTimeStart();
        console.log('start record');
        this.setState({ isAudioFile: '', isAudioRecording: true });
        await AudioRecord.start();
      }
    } catch (e) {
      console.log('audioRecord', e);
    }
  };

  audioRecordStop = async () => {
    try {
      this.onVideoTimeClear();
      if (this.state.isAudioRecording == true) {
        console.log('Opening audio preview modal');
        this.setState({
          isAudioRecording: false,
          showRecordedAudio: true,
          isAudioRecordModal: false,
          isAudioPreviewModal: true,
        });
      }
      file =
        'lb_aud_' +
        new Date().getFullYear() +
        new Date().getMonth() +
        new Date().getDate() +
        '_' +
        new Date().getHours() +
        new Date().getMinutes() +
        new Date().getSeconds() +
        '_' +
        new Date().getMilliseconds() +
        '_' +
        new Date().getUTCMilliseconds() +
        '.mp3';
      var postDestFilePaths = audioDir + '/' + file;
      let isAudioFiles = await AudioRecord.stop();
      console.log('audioFile', isAudioFiles);
      var uriAudio = 'file://' + isAudioFiles;

      this.play();
      this.timeout = setInterval(() => {
        if (
          this.sound &&
          this.sound.isLoaded() &&
          this.state.playState == 'playing' &&
          !this.sliderEditing
        ) {
          this.sound.getCurrentTime((seconds) => {
            this.setState({ playSeconds: seconds });
          });
        }
      }, 1000);
      //}
      // else {
      //     ToastAndroid.show("Audio not recording", ToastAndroid.show)
      // }
    } catch (error) { }
  };

  render() {
    return (
      <View>
        <View style={styles.recordView}>
          <TouchableOpacity onPress={() => start()}>
            <Image source={record} style={styles.icons} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => stop()}>
            <Image source={stopicon} style={styles.icons} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => play()}>
            <Image source={playIcon} style={styles.icons} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pause()}>
            <Image source={pauseIcon} style={styles.icons} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  recordView: {
    justifyContent: 'space-between',
    margin: 20,
    flexDirection: 'row'
  },
  icons: {
    height: 35,
    width: 35,
    marginHorizontal: 10
  },
})