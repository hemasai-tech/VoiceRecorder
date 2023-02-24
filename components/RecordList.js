import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  ToastAndroid,
  FlatList,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import Sound from 'react-native-sound';
import Permissions from 'react-native-permissions';
import {Buffer} from 'buffer';
import RecordComponent from './RecordComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecordList = props => {
  const refRBSheet = useRef();
  var Records = [];
  var newArray = [];
  const [recordsList, setRecordsList] = useState([]);
  const [state, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    Sound.setCategory('Playback');
    getItem();
  }, [refRBSheet]);

  const playFn = item => {
    var whoosh = new Sound(item, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' +
          whoosh.getDuration() +
          'number of channels: ' +
          whoosh.getNumberOfChannels(),
      );

      // Play the sound with an onEnd callback
      whoosh.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  };

  const getItem = async () => {
    try {
      let getRecordings = await AsyncStorage.getItem('Recordings');
      let parsedRecords = JSON.parse(getRecordings);
      console.log('parsedRecords!!!!!!!!!!!', parsedRecords);
      setRecordsList(parsedRecords);
    } catch (error) {
      console.log(error);
    }
  };

  const renderRecordList = ({item, index}) => {
    console.log(item, 'Item@@@@@@@@@@@@@@@@@@@');
    return (
      <View>
        <TouchableOpacity style={styles.listView} onPress={() => playFn(item)}>
          <Text style={styles.listItem}>{item.audio}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.lisMain}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => refRBSheet.current.open()}>
        <Text style={styles.btnTxt}>{`New ${
          props && props?.route?.params?.dateSelected
        }`}</Text>
      </TouchableOpacity>
      <FlatList
        data={recordsList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item, index) => renderRecordList(item, index)}
      />
      <RBSheet
        height={400}
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        animationType={'fade'}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            borderRadius: 20,
            backgroundColor: '#432C7A',
          },
        }}>
        <RecordComponent
          refRBSheet={refRBSheet}
          callBackfn={list => {
            setRecordsList(list);
            console.log(list, 'List In recordList.js');
          }}
        />
      </RBSheet>
    </View>
  );
};
export default RecordList;
const styles = StyleSheet.create({
  lisMain: {
    // backgroundColor: "#FEDEFF"
  },
  listView: {
    backgroundColor: 'yellow',
    paddingHorizontal: 10,
  },
  listItem: {
    margin: 3,
    backgroundColor: 'red',
    color: 'white',
    fontWeight: '800',
    fontSize: 15,
  },
  image: {
    height: '100%',
  },
  btn: {
    backgroundColor: '#FEFBE9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 20,
    borderRadius: 10,
  },
  btnTxt: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontWeight: '700',
    fontSize: 20,
    color: '#18122B',
  },
});
