import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, ImageBackground, BackHandler, Alert } from 'react-native'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome'

const img = require('../assets/img/close.png')
const mixer = require('../assets/img/Mixer.jpg')
const Audio = (props) => {
  const { navigation } = props;
  const [date, selectDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const datenew = new Date()
  const latestDate = moment(datenew).format("YYYY-MM-DD")
  return (
    <View style={styles.mainView}>
      {/* <ImageBackground source={mixer} resizeMode="stretch" style={styles.image}> */}

      <View>
        <Text style={styles.headerTxt}>Memories</Text>
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
        <Text style={styles.btnTxt}>Add</Text>
      </TouchableOpacity>
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.clndrRow}>
              <View style={styles.showDateView}>
                <Text style={styles.showDate}>{date !== '' ? date : latestDate}</Text>
              </View>
              <TouchableOpacity style={{ marginLeft: 'auto', marginRight: 5, padding: 5 }} onPress={() => setModalVisible(false)}>
                <Image source={img} style={{ height: 13, width: 13, tintColor: '#2D033B' }} />
              </TouchableOpacity>
            </View>
            <View>
              <Calendar
                initialDate={latestDate}
                onDayPress={day => {
                  selectDate(day.dateString)
                  navigation.navigate("RecordList", {
                    dateSelected: day.dateString
                  })
                  console.log('selected day', day.dateString);
                }}
                enableSwipeMonths={true}
                theme={{
                  backgroundColor: '#ffffff',
                  calendarBackground: '#C689C6',
                  textSectionTitleColor: '#ffffff',
                  textSectionTitleDisabledColor: '#d9e1e8',
                  selectedDayBackgroundColor: '#ffffff',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#ffffff',
                  dayTextColor: '#2D033B',
                  textDisabledColor: '#d9e1e8',
                  dotColor: '#00adf5',
                  selectedDotColor: '#ffffff',
                  arrowColor: '#2D033B',
                  disabledArrowColor: '#d9e1e8',
                  monthTextColor: '#2D033B',
                  indicatorColor: 'blue',
                  textDayFontFamily: 'monospace',
                  textMonthFontFamily: 'monospace',
                  textDayHeaderFontFamily: 'seriff',
                  textDayFontWeight: '700',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '900',
                  textDayFontSize: 18,
                  textMonthFontSize: 20,
                  textDayHeaderFontSize: 16,
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* </ImageBackground> */}
    </View>
  )
}

export default Audio;
export const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#FEDEFF',
    flex: 1
  },
  headerTxt: {
    fontSize: 30,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center',
    marginTop: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 3
  },
  header: {

  },
  addBtn: {
    backgroundColor: '#2D033B',
    marginLeft: 'auto',
    marginRight: 10,
    borderRadius: 10,
  },
  btnTxt: {
    color: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
    fontWeight: 'bold',
    fontSize: 20
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 300,
    width: '95%'
  },
  image: {
    height: '100%',
  },
  showDate: {
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center'
  },
  showDateView: {
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: 'auto'
  },
  clndrRow: {
    flexDirection: 'row',
    padding: 15
  }
})
