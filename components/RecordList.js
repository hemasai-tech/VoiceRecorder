import { View, Text, Touchable, TouchableOpacity, Image, ImageBackground, StyleSheet, Alert, PermissionsAndroid, ToastAndroid } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import RBSheet from "react-native-raw-bottom-sheet";
import Sound from 'react-native-sound';
import Permissions from 'react-native-permissions';
import { Buffer } from 'buffer';
import RecordComponent from './RecordComponent';


const RecordList = (props) => {

  const refRBSheet = useRef();

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
        <RecordComponent />
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
})