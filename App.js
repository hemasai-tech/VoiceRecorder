import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Audio from '../AwesomeProject/components/Audio';
import Splash from '../AwesomeProject/components/Splash';
import RecordList from './components/RecordList';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <View style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={({navigation}) => ({
              title: '',
              statusBarColor: '#432C7A',
              navigationBarColor: '#432C7A',
            })}
          />
          <Stack.Screen
            name="Audio"
            component={Audio}
            options={({navigation}) => ({
              title: 'Add Screen',
              statusBarColor: '#432C7A',
              navigationBarColor: '#432C7A',
            })}
          />
          <Stack.Screen
            name="RecordList"
            component={RecordList}
            options={({navigation}) => ({
              title: 'Record List',
              statusBarColor: '#432C7A',
              navigationBarColor: '#432C7A',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
