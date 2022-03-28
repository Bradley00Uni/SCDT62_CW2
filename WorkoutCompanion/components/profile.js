import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions, Linking } from 'react-native';
import { Card, Overlay } from 'react-native-elements';
import { Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Restart} from 'fiction-expo-restart';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from '@react-navigation/native';

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
  }, [loading])

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
      return fetch(`https://workoutapi20220309144340.azurewebsites.net/api/activities/user/stats/${user}`).then( (response) => response.json()).then( (responseJson) => {
            setActivities(responseJson)
            setLoading(false)

        })
        .catch((error) => {console.log(error)})
    }

    const getWorkouts = async () => {
      getUser()
      return fetch(`https://workoutapi20220309144340.azurewebsites.net/api/workouts/user/stats/${user}`).then( (response) => response.json()).then( (responseJson) => {
            setWorkouts(responseJson)
            getActivities()

        })
        .catch((error) => {console.log(error)})
    }

    const ActivityInformation = () => {

      if(activities != null){
        //Add Update Buttons to manually call functions for Activites and Workouts
        let difference = (activities.activityCount - activities.typeCount)
        let differenceMessage = "";
        if(difference < (activities.activityCount / 2)){
          differenceMessage = "That makes up over Half of your Activities. It's important to vary your workouts, so why not add some different types"
        }
        else{
          differenceMessage = "Which covers  " + activities.typeCount + " Activities"
        }

        if(activities.commonType){
          return (
            <Card style={styles.item}  containerStyle={styles.itemContainer}>
              <Card.Title h4>Activity Breakdown</Card.Title>
              <Card.Divider color='#47504f' width={2} />
              <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 15}}>You currently have {activities.activityCount} Activities saved </Text>
              
              <Text style={{fontSize: 18, textAlign: 'center'}}>The most common type is {activities.commonType}</Text>
              <Text style={{fontSize: 15, textAlign: 'center', fontStyle: 'italic', marginTop: 5}}>{differenceMessage}</Text>
            </Card>
          )
        }
        else{
          return(
            <Card style={styles.item}  containerStyle={styles.itemContainer}> 
              <Card.Title h4>Activity Recap</Card.Title>
              <Card.Divider color='#47504f' width={2} />
              <Text style={{fontSize: 18, textAlign: 'center'}}>You don't currently have any Activity types stored on this App, you can add some from the Actvity tab</Text>
            </Card>
          )
        }
      }
      else{
        return (
          <View></View>
        )
      }
    }

    const WorkoutInformation = () => {
      //<Text>You currently have {workouts.workoutCount} workouts recorded, (Total Duration) (Average Duration) (Average Number of Activities) (Visit the Tab)</Text>
     if (workouts != null){
       if(workouts.workoutCount > 0){
        return (
          <Card style={styles.item}  containerStyle={styles.itemContainer}>
            <Card.Title h4>30-Day Recap</Card.Title>
            <Card.Divider color='#47504f' width={2} />

            <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 15}}>You have recorded {workouts.workoutCount} workouts this Month</Text>

            <Text style={{fontSize: 18, fontWeight: 'bold'}}>On Average, your workouts:</Text>
            <Text style={{fontSize: 18}}>Contain {workouts.averageActivities} activities</Text>
            <Text style={{fontSize: 18}}>Each last {workouts.averageDuration} minutes</Text>

            <Text style={{fontSize: 18, fontWeight: 'bold'}}>In Total, you have achieved:</Text>
            <Text style={{fontSize: 18}}>Finishing {workouts.totalActivities} demanding activities</Text>
            <Text style={{fontSize: 18}}>An overall duration of {workouts.totalDuration} minutes exercising</Text>
          </Card>
        )
       }
       else{
         return (
          <Card style={styles.item} containerStyle={styles.itemContainer}>
            <Card.Title h4>30-Day Recap</Card.Title>
            <Card.Divider color='#47504f' width={2} />
            <Text style={{fontSize: 18}}>In the Last 30 Days, you have recorded {workouts.workoutCount} workouts.</Text>
            <Text style={{fontSize: 14}}>You can create some from the Workouts tab of the App, be sure you have created some activities, to allow for detailed breakdowns here</Text>
          </Card>
         )
       }
     }
     else{
       return (
         <View>
         </View>
       )
     }
    }

    const openLink = async () => {
      await Linking.openURL('https://www.google.co.uk/maps/search/gyms')
    }

    const NearbyLocations = () => {
      return (
        <Card style={styles.item} containerStyle={styles.itemContainer}>
          <Card.Title h4>Not sure where to Workout?</Card.Title>
          <Card.Divider color='#47504f' width={2} />

          <Text style={{fontSize: 18, textAlign: 'center', marginBottom: 15}}>Fancy Going somewhere to exercise? Click this button to discover nearby Gyms</Text>
          <Button title="Go Explore" onPress={() => openLink()} color={'#18a4bc'} />
        </Card>
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
            <Appbar.Action icon="refresh" accessibiltyLevel onPress={() => getWorkouts()} />
              <Appbar.Content title="WorkoutCompanion" />
              <Appbar.Action icon="exit-to-app" accessibiltyLevel onPress={() => logoutConfirm()} />
            </Appbar.Header>
            <ScrollView style={styles.scrolling} contentContainerStyle={styles.scrollingContainer}>
              <Text style={styles.title}>{nameDisplay}</Text>

              <WorkoutInformation />
              <ActivityInformation />
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
      width: Dimensions.get('window').width - 15,
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
    item: {
      flexDirection: 'row',
      borderRadius: 80,
      height: 150,
    },
    itemContainer: {
      backgroundColor: '#E6D1F2', 
      borderColor: '#47504f', 
      borderWidth: 3, 
      borderRadius: 6,
      width: Dimensions.get('window').width - 18,
    },
})

export default Profile
