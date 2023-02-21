import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Sound from 'react-native-sound';
import { AudioRecorder, AudioUtils } from 'react-native-audio';

const RecordComponent = () => {
  const [recordings, setRecordings] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);


  const startRecording = async () => {
    try {
      let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';

      AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: "Low",
        AudioEncoding: "aac"
      });
      const recording = await AudioRecorder.startRecording();
      setRecordings([...recordings, recording]);
      setSelectedIndex(recordings.length);
    } catch (error) {
      console.log(error);
    }
  };

  const playAudio = (index) => {
    const sound = new Sound(recordings[index], "", (error) => {
      if (error) {
        console.log('Error loading sound:', error);
      } else {
        setSelectedIndex(index);
        sound.play((success) => {
          if (success) {
            console.log('Sound played successfully');
          } else {
            console.log('Sound playback failed');
          }
        });
      }
    });
  };

  const pauseAudio = (index) => {
    let pause = new Sound;
    pause.pause()

  };

  const stopAudio = (index) => {
    const stopSound = new Sound(recordings[index], Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Error loading sound:', error);
      } else {
        setSelectedIndex(index);
        stopSound.stop((success) => {
          if (success) {
            console.log('Sound played successfully');
          } else {
            console.log('Sound playback failed');
          }
        });
      }
    });
    setSelectedIndex(null);
  };



  return (
    <View>
      <Text>RecordComponent</Text>
      {console.log("recordings", recordings)}
      <View>
        {recordings.map((recording, index) => (
          <View key={index}>
            <TouchableOpacity onPress={() => playAudio(index)}>
              <Text>Recording {index + 1}</Text>
            </TouchableOpacity>
            {selectedIndex === index ? (
              <>
                <TouchableOpacity onPress={() => pauseAudio(index)}>
                  <Text>Pause</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => stopAudio(index)}>
                  <Text>Stop</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        ))}
        <TouchableOpacity onPress={() => startRecording()}>
          <Text>Start Recording</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default RecordComponent;