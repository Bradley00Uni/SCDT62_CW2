import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Container, Button, Text, TextInput, Alert } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'

import Activities from './components/activities';
import Workouts from './components/workouts';
import Profile from './components/profile';

//Main Function returned by App.Js
//Opened on Application Start
export default function App() {
  useEffect(() => {
    readToken()
  }, [token, index]) //Only Calls when either token, or index are modified

  //Set variables used when accessing Async Storage
  const STORAGE_TOKEN = '@token'
  const STORAGE_USER = '@user'
  const STORAGE_NAME = '@name'

  //Declare State Variables
  const [token, setToken] = useState(null)
  const [loginState, setLoginState] = useState(true)
  const [returned, setReturned] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [index, setIndex] = useState(0);
  //Define the routes used for page navigation
  const [routes] = useState([
    {key: 'home', title: 'Home', icon: 'home', color: '#434371'},
    {key: 'workouts', title: 'Workouts', icon: 'routes-clock', color: '#ACDEAA'},
    {key: 'activities', title: 'Activities', icon: 'walk', color: '#f06c64'},
  ]);

  //Function used to convert returned JSON into Async Storage variables and session token
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
  
  //Function used to validate if the current session has a valid JWT token
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

  //Renders the navigation
  const renderScene = BottomNavigation.SceneMap({
    home: Profile,
    activities: Activities,
    workouts: Workouts,
  });

  //Function to edit variables when the User switches between the 'Login' and 'Register' forms
  const loginStateChange = () => {
    setLoginState(!loginState)
    setFirstName('')
    setLastName('')
  }

  //Sends the entered form Data to the API to validate a Login attempt
  const sendLogin = async () => {
    let data = {
      "email" : email,
      "password" : password
    }

    //GET Request to Login API Route
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
      //Set App Session Token to returned JWT token from API
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

  //Sends the entered form Data to the API to validate a Register attempt
  const sendRegister = async () => {
    let data = {
      "FirstName" : firstName,
      "LastName" : lastName,
      "Email" : email,
      "Password" : password
    }

    //POST Request to Register API Route
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

  //This view is shown if the User is not logged in
  if(token == null){
    //This view is shown when the user wants to log in
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
      //This view is shown when the user wants to register
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
    //Displays the Navigation Component
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

//Stores styles for use in interface
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

