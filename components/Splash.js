import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, Touchable, TouchableOpacity, View, ImageBackground, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const image = require('../assets/img/splash2.jpg')
const Splash = (props) => {
  const { navigation } = props
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Audio")
    }, 3000)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.main}>
        </View>
      </ImageBackground>
    </View >
  );
}

export default Splash;
const styles = StyleSheet.create({
  image: {
    height: '100%'
  },
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  welcomeTxt: {
    fontSize: 50,
    fontWeight: 'bold',
    color: "#F0EEED",
    textAlign: 'center'
  }
})


