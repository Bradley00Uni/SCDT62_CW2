import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Container, Button, Text, TextInput } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNRestart from 'react-native-restart'

import Activities from './components/activities';
import Workouts from './components/workouts';
import Home from './components/home'

const ProfileRoute = () => <Text>Profile</Text>;
export default function App() {
  useEffect(() => {
    readToken()
  }, [token])

  const STORAGE_TOKEN = '@token'

  const [token, setToken] = useState(null)
  const [loginState, setLoginState] = useState(true)
  const [returned, setReturned] = useState('')

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

  const saveToken = async (t) => {
    try {
      await AsyncStorage.setItem(STORAGE_TOKEN, t)
      console.log('Token Set Successfully')
      setToken(t)
      return('Login Successfully Validated')
    }
    catch (e){
      return('Failed to Validate Login')
    }
  }
  
  const readToken = async () => {
    try {
      const asyncToken = await AsyncStorage.getItem(STORAGE_TOKEN)
      console.log(AsyncStorage)
  
      if(asyncToken !== null){
        setToken(asyncToken)
      }
    }
    catch (e){
      console.log('Not Logged In')
    }
  }

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
    let data = {
      "email" : email,
      "password" : password
    }

    let response = await fetch('https://workoutapi20220309144340.azurewebsites.net/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    let result = await response.json()

    if(response.status == 200){
      saveToken(result.token)
    }
    else{
        var errors = Object.values(result.errors);
        var error_messages = ''
  
        for (let e of errors){
          error_messages += e;
        }
        setReturned(error_messages)
    }
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
          <Button title='Login' onPress={(email) => sendLogin(email)} />
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