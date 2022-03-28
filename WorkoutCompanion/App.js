import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Container, Button, Text, TextInput, Alert } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'

import Activities from './components/activities';
import Workouts from './components/workouts';
import Profile from './components/profile';

export default function App() {
  useEffect(() => {
    readToken()
  }, [token, index])

  const STORAGE_TOKEN = '@token'
  const STORAGE_USER = '@user'
  const STORAGE_NAME = '@name'

  const [token, setToken] = useState(null)
  const [loginState, setLoginState] = useState(true)
  const [returned, setReturned] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'home', title: 'Home', icon: 'home', color: '#434371'},
    {key: 'workouts', title: 'Workouts', icon: 'routes-clock', color: '#ACDEAA'},
    {key: 'activities', title: 'Activities', icon: 'walk', color: '#f06c64'},
  ]);

  const saveToken = async (result) => {
    try {
      await AsyncStorage.setItem(STORAGE_TOKEN, result.token)
      console.log('Token Set Successfully')

      await AsyncStorage.setItem(STORAGE_USER, result.id)
      console.log('ID set Successfully')

      await AsyncStorage.setItem(STORAGE_NAME, result.firstName)

      setToken(result.token)
      return('Login Successfully Validated')
    }
    catch (e){
      return('Failed to Validate Login')
    }
  }
  
  const readToken = async () => {
    try {
      const asyncToken = await AsyncStorage.getItem(STORAGE_TOKEN)
  
      if(asyncToken !== null){
        setToken(asyncToken)
      }
    }
    catch (e){
      console.log('Not Logged In')
    }
  }

  const renderScene = BottomNavigation.SceneMap({
    home: Profile,
    activities: Activities,
    workouts: Workouts,
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
      console.log(result)
      saveToken(result)
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
    let data = {
      "FirstName" : firstName,
      "LastName" : lastName,
      "Email" : email,
      "Password" : password
    }

    let response = await fetch('https://workoutapi20220309144340.azurewebsites.net/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    let result = await response.json()

    if(response.status == 200){
      setReturned("Registration Successfull")
      loginStateChange()
    }
  }

  if(token == null){
    if(loginState){
      return (
        <View style={styles.container}>
          <MaterialCommunityIcons name='weight-lifter' size={100} color="black" />
          <Text style={styles.mainTitle}>WorkoutCompanion</Text>

          <Text style={styles.title}>Login</Text>
          <TextInput style={styles.input} placeholder='Email' onChangeText={(email) => setEmail(email)} />
          <TextInput style={styles.input} secureTextEntry={true} placeholder='Password' onChangeText={(password) => setPassword(password)} />

          <View style={styles.inputButton}>
            <Button title='Login' color={'#28b44c'} onPress={(email) => sendLogin(email)} />
          </View>

          <Text style={styles.notation}>Not Signed Up?</Text>

          <View style={styles.secondaryButton}>
            <Button title='Register Now' color={'#f8ac4c'} onPress={loginStateChange} />
          </View>
        </View>
      )
    }
    else{
      return (
        <View style={styles.container}>
          <MaterialCommunityIcons name='weight-lifter' size={100} color="black" />
          <Text style={styles.mainTitle}>WorkoutCompanion</Text>

          <Text style={styles.title}>Register</Text>
          <TextInput style={styles.input} placeholder='Email' onChangeText={(email) => setEmail(email)} />
          <TextInput style={styles.input} secureTextEntry={true} placeholder='Password' onChangeText={(password) => setPassword(password)} />
          <TextInput style={styles.input} placeholder='Name' onChangeText={(firstName) => setFirstName(firstName)} />
          <TextInput style={styles.input} placeholder='Surname' onChangeText={(lastName) => setLastName(lastName)} />
          <View style={styles.inputButton}>
            <Button title='Register' color={'#28b44c'} onPress={(email) => sendRegister(email)} />
          </View>

          <Text style={styles.notation}>Already a Member?</Text>

          <View style={styles.secondaryButton}>
            <Button title='Login Now' color={'#f8ac4c'} onPress={loginStateChange} />
          </View>
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
        shifting={true}
      />  
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BEA9DF'
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    marginLeft: 40,
    marginRight: 40,
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
    borderColor: '#47504f', 
    borderWidth: 2, 
    borderRadius: 15,
    width: 300,
  },
  inputButton: {
    width: 280,
    marginBottom: 20
  },
  notation: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
  title: {
    fontSize: 30,
    textAlign: 'center'
  },
  mainTitle: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 80,
    marginTop: 10,
    fontWeight: 'bold'
  },
  secondaryButton: {
    width: 130,
    marginTop: 10
  },
})