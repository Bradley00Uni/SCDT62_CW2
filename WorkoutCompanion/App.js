import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Container, Button, Text, TextInput } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Activities from './components/activities';
import Workouts from './components/workouts';
import Home from './components/home'

const ProfileRoute = () => <Text>Profile</Text>;

export default function App() {
  const [token, setToken] = useState(null)
  const [loginState, setLoginState] = useState(true)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'home', title: 'Home', icon: 'home', color: '#ff964f'},
    {key: 'activities', title: 'Activities', icon: 'walk', color: '#f06c64'},
    {key: 'workouts', title: 'Workouts', icon: 'routes-clock', color: '#ACDEAA'},
    {key: 'profile', title: 'Profile', icon: 'account', color: '#CBAACB'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    activities: Activities,
    workouts: Workouts,
    profile: ProfileRoute,
  });

  const loginStateChange = () => {
    setLoginState(!loginState)
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
  }

  const sendLogin = async () => {

  }

  const sendRegister = async () => {

  }

  if(token == null){
    if(loginState){
      return (
        <View style={styles.container}>
          <Text>Login</Text>
          <TextInput style={styles.input} placeholder='Email' onChangeText={(email) => setEmail(email)} />
          <TextInput style={styles.input} placeholder='Password' onChangeText={(password) => setPassword(password)} />
          <Button title='Login' onPress={() => sendLogin()} />
          <Button title='Not a Member? Register' onPress={loginStateChange} />
        </View>
      )
    }
    else{
      return (
        <View style={styles.container}>
          <Text>Register Screen</Text>
          <Button title='Login' onPress={loginStateChange} />
        </View>
      )
    }
  }
  else{
    return (
      <BottomNavigation
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />  
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d8ecac'
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    marginTop: 15,
    textAlign: 'center',
    borderRadius: 10,
  },
})