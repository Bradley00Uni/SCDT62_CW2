import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay } from 'react-native-elements';
import { Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Restart} from 'fiction-expo-restart';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Profile = () => {
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [id, setID] = useState('')

  const [latestWorkout, setLatestWorkout] = useState(null)

  const STORAGE_TOKEN = '@token'
  const STORAGE_NAME = '@name'

  useEffect(async () => {
    const getName = await AsyncStorage.getItem(STORAGE_NAME)
    setName(getName)

  }, [])

    const logoutConfirm = () => {
        return (
          <>
          {Alert.alert(
            "Logout Confirmation",
            "Are you sure you want to Logout?",
            [
                {text: "Yes", onPress: () => {logout()}}, {text: "No"}
            ]
          )}
          </>
        )
      }
    
    const logout = async () => {
        let response = await fetch('https://workoutapi20220309144340.azurewebsites.net/api/auth/Logout', {
        method: 'POST',
        })
        let result = response.json()
    
        if(response.status == 200){
            console.log("Logged Out")
            await AsyncStorage.removeItem(STORAGE_TOKEN)
            Restart()
        }
    }

    const getWorkout = async () => {
      
    }

    
    let nameDisplay = ("Welcome Back " + name)

    return (
        <View style={styles.container}>
          <Appbar.Header style={styles.profile_header}>
            <Appbar.Content title="WorkoutCompanion" />
            <Appbar.Action icon="exit-to-app" accessibiltyLevel onPress={() => logoutConfirm()} />
          </Appbar.Header>
          <ScrollView style={styles.scrolling} contentContainerStyle={styles.scrollingContainer}>
            <Text style={styles.title}>{nameDisplay}</Text>
          </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BEA9DF'
      },
      profile_header: {
        flexDirection: 'row', 
        backgroundColor: '#434371', 
        justifyContent: 'center',
        padding: 8,
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
    scrolling: {
      width: Dimensions.get('window').width,
    },
    scrollingContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      fontSize: 30,
      textAlign: 'center'
    },
})

export default Profile
