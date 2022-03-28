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
  const [user, setUser] = useState('')

  const [workouts, setWorkouts] = useState(null)
  const [activities, setActivities] = useState(null)

  const STORAGE_TOKEN = '@token'
  const STORAGE_NAME = '@name'
  const STORAGE_USER = '@user'

  useEffect(() => {
    getWorkouts()
    getActivities()
    setLoading(false)
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

  const getUser = async () => {
    const id = await AsyncStorage.getItem(STORAGE_USER)
    setUser(id)

    const getName = await AsyncStorage.getItem(STORAGE_NAME)
    setName(getName)
  }

    const getActivities = async () => {
      return fetch(`https://workoutapi20220309144340.azurewebsites.net/api/activities/user/${user}`).then( (response) => response.json()).then( (responseJson) => {
            setActivities(responseJson)

        })
        .catch((error) => {console.log(error)})
    }

    const getWorkouts = async () => {
      getUser()
      return fetch(`https://workoutapi20220309144340.azurewebsites.net/api/workouts/user/${user}`).then( (response) => response.json()).then( (responseJson) => {
            setWorkouts(responseJson)

        })
        .catch((error) => {console.log(error)})
    }

    const ActivityInformation = () => {
      if(activities != null){
        let activityCount = activities.length
        //Add Update Buttons to manually call functions for Activites and Workouts
        return (
          <View>
            <Text>You currently have {activityCount} activities saved, the most common type is: ##. You can add more in the 'Activites' tab of the app</Text>
          </View>
        )
      }
      else{
        return (
          <View></View>
        )
      }
    }

    const WorkoutInformation = () => {
     if (workouts != null){
       let workoutCount = workouts.length
       return (
         <View>
           <Text>You currently have {workoutCount} workouts recorded, (Total Duration) (Average Duration) (Compare Against a Statistic) (Average Number of Activities) (Visit the Tab)</Text>
         </View>
       )
     }
     else{
       return (
         <View>
           <Text></Text>
         </View>
       )
     }
    }

    const NearbyLocations = () => {
      return (
        <View>
           <Text>Attempt to Add Google Maps Plugin or Link</Text>
        </View>
      )
    }
    
    if(loading){
      return (
        <View></View>
      )
    }
    else{
      let nameDisplay = ("Welcome Back, " + name)
      return (
          <View style={styles.container}>
            <Appbar.Header style={styles.profile_header}>
              <Appbar.Content title="WorkoutCompanion" />
              <Appbar.Action icon="exit-to-app" accessibiltyLevel onPress={() => logoutConfirm()} />
            </Appbar.Header>
            <ScrollView style={styles.scrolling} contentContainerStyle={styles.scrollingContainer}>
              <Text style={styles.title}>{nameDisplay}</Text>

              <ActivityInformation />
              <WorkoutInformation />
              <NearbyLocations />

            </ScrollView>
          </View>
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
      fontSize: 35,
      textAlign: 'center',
      marginTop: 30,
    },
})

export default Profile
