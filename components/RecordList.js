import { View, Text, Touchable, TouchableOpacity, Image, ImageBackground, StyleSheet, Alert, PermissionsAndroid } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import RBSheet from "react-native-raw-bottom-sheet";
import AudioRecord from 'react-native-audio-record';
import Sound from 'react-native-sound';
import Permissions from 'react-native-permissions';
import { Buffer } from 'buffer';


const image = require('../assets/img/Bg.jpg')
const record = require('../assets/img/record.png')
const playIcon = require('../assets/img/play.png')
const stopicon = require('../assets/img/stop.png')
const pauseIcon = require('../assets/img/pause.png')

const RecordList = (props) => {
  global.sound = null;
  const [audioFile, setAudioFile] = useState('');
  const [recording, setRecording] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(false);

  const refRBSheet = useRef();

  useEffect(() => {
    checkPermission();

    const options = {
      sampleRate: 16000,  // default 44100
      channels: 1,        // 1 or 2, default 1
      bitsPerSample: 16,  // 8 or 16, default 16
      audioSource: 6,     // android only (see below)
      wavFile: 'test.wav' // default 'audio.wav'
    };
    AudioRecord.init(options);

    AudioRecord.on('data', data => {
      // base64-encoded audio data chunks
      const chunk = Buffer.from(data, 'base64');
      console.log('chunk', chunk.byteLength)
    });

  }, [])

  const reuqestPermission = async () => {
    const p = await Permissions.request('microphone');
    console.log('permission request', p)
  }

  const checkPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Requesting Permission",
        message: "To Record MEMORIES you need to give permission for the App .",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cance",
        buttonPositive: "OK"
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('permission granted');
    } else {
      console.log('permission denied');
      return reuqestPermission();
    }

  }

  const start = () => {
    setAudioFile('');
    setRecording(true);
    setLoaded(false);
    AudioRecord.start();
  }
  const stop = async () => {
    if (!recording) {
      return;
    }
    let audioFile = await AudioRecord.stop();
    console.log('audioFile', audioFile);
    setAudioFile(audioFile);
    setRecording(false);

  }

  const onLoad = () => {
    return new Promise((resolve, reject) => {
      if (!audioFile) {
        return reject("File path is empty")
      }

      global.sound  = new Sound(audioFile, error => {
        if (error) {
          return reject(error)
        }
        setLoaded(true);
        return resolve();
      });
      console.log("sound",global.sound );
    });
  }

  const play = async () => {
    console.log(global.sound );
    if (!loaded) {
      try {
        await onLoad();
      } catch (error) {
        console.log(error);
      }
    }
    console.log('playingggg');
    setPaused(false);
    Sound.setCategory('Playback');
    global.sound.play(success => {
      if (success) {
        console.log('Playted Successfully');
      } else {
        console.log('playback failed due to errors');
      }
      setPaused(true)
    })
  }

  const pause = () => {
    console.log('pausinggg');
    global.sound.pause();
    setPaused(true)
  }

  return (
    <View style={styles.lisMain}>
      {/* <ImageBackground source={image} resizeMode="cover" style={styles.image}> */}
      <TouchableOpacity style={styles.btn} onPress={() => refRBSheet.current.open()}>
        <Text style={styles.btnTxt}>{`New ${props && props?.route?.params?.dateSelected}`}</Text>
      </TouchableOpacity>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        animationType={"slide"}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent"
          },
          draggableIcon: {
            backgroundColor: "#810CA8"
          }
        }}
      >
        <View style={styles.recordView}>
          <TouchableOpacity onPress={() => start()}>
            <Image source={record} style={{ height: 55, width: 55 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => stop()}>
            <Image source={stopicon} style={{ height: 55, width: 55 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => play()}>
            <Image source={playIcon} style={{ height: 55, width: 55 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pause()}>
            <Image source={pauseIcon} style={{ height: 55, width: 55 }} />
          </TouchableOpacity>
        </View>
      </RBSheet>
      {/* </ImageBackground> */}
    </View>
  )
}
export default RecordList;
const styles = StyleSheet.create({
  lisMain: {
    // backgroundColor: "#FEDEFF"
  },
  image: {
    height: '100%'
  },
  btn: {
    backgroundColor: "#FEFBE9",
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 20,
    borderRadius: 10
  },
  btnTxt: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontWeight: '700',
    fontSize: 20,
    color: '#18122B',
  },
  recordView: {
    alignItems: 'center',
    margin: 20
  },
})