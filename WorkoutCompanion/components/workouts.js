import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay } from 'react-native-elements';
import { Appbar } from 'react-native-paper';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import {FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'

import Details from './workout/details';
import Create from './workout/create';

const Workouts = () => {
    const STORAGE_USER = '@user'
    const [workouts, setWorkouts] = useState(null);

    const [loading, setLoading] = useState(true)
    const [returned, setReturned] = useState('')

    const [detailsVisible, setDetailsVisible] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);

    const [currentWorkout, setCurrentWorkout] = useState(null);
    const [user, setUser] = useState(null)

    const [datePickerVisible, setDatePickerVisible] = useState(false)

    useEffect(() => {
        getUser()
        //Fetch all workouts assosciated with the current user - allows workout list to dynamically update
        return fetch(`https://workoutapi20220309144340.azurewebsites.net/api/workouts/user/${user}`).then( (response) => response.json()).then( (responseJson) => {
            setWorkouts(responseJson)
            setLoading(false)

        })
        .catch((error) => {console.log(error)})
    },)

    //Function to get the current user's ID from Async Storage, so it can be passed in a fetch request to return the correct workouts
    const getUser = async () => {
        const id = await AsyncStorage.getItem(STORAGE_USER)
        setUser(id)
    }

    //Function to manage the visibility of the Date Picker used when creating a workout
    const setDatePicker =() => {setDatePickerVisible(!datePickerVisible)}

    //Sends entered values for new Workout to the API, creating a new Workout model
    const sendWorkout = async (d) => {
        let data = {
            "workoutCreated" : d,
            "userID" : user
        }

        const response = await fetch('https://workoutapi20220309144340.azurewebsites.net/api/workouts', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        let result = await response.json()
        console.log(response.status)

        if(response.status == 201){
            setReturned("Success")
            showMessage({
                message: "Creation Successful",
                type: "success"
            });
        }
        else{
            var errors = Object.values(result.errors);
            var error_messages = ''
      
            for (let e of errors){
              error_messages += e;
            }
            setReturned(error_messages)
            showMessage({
                message: error_messages,
                type: "danger"
            });
        }
    }

    //Converts the datetime stored for each workout into a more traditional format, that is easier to read for users
    const convertDate =(date) => {

        var newDate = date.toString()
        var month = newDate.substring(5,7);
        var day = newDate.substring(8,10);

        if(day.charAt(0) == "0"){
            day = day - day.charAt(0)
        }

        if(day == "01"||day == "21"||day == "31"){day = day + "st"}
        else if(day == "02"||day == "22"){day = day + "nd"}
        else if(day == "03"||day == "23"){day = day + "rd"}
        else{day = day + "th"}

        switch (month) {
            case "01": month = "January"; break;
            case "02": month = "February"; break;
            case "03": month = "March"; break;
            case "04": month = "April"; break;
            case "05": month = "May"; break;
            case "06": month = "June"; break;
            case "07": month = "July"; break;
            case "08": month = "August"; break;
            case "09": month = "September"; break;
            case "10": month = "October"; break;
            case "11": month = "November"; break;
            case "12": month = "December"; break;
        }
        newDate = month + " " + day
        return newDate
    }

    //Functions for managing the visibility of the Create and Details overlays respectively
    const toggleDetails = () => { setDetailsVisible(!detailsVisible) }
    const toggleCreate = () => { setCreateVisible(!createVisible) }

    //Displays alert box to confirm user wishes to delete the selected workout
    const deleteConfirm = (val) => {
        return Alert.alert(
            "Are you sure?",
            "Are you sure you want to delete this Workout?",
            [
                {text: "Yes", onPress: () => {deleteWorkout(val.workout.id)}}, {text: "No"}
            ]
        )
    }

    //Function to send API call to delete the selected workout and asosciated exercises
    const deleteWorkout = async (id) => {
        let data = id;

        const response = await fetch(`https://workoutapi20220309144340.azurewebsites.net/api/workouts/${data}`, {
            method: 'DELETE',
            body: data
        })
        let result = await response

        if(result.status == 204){
            setReturned("Success")
            showMessage({
                message: "Activity Deleted",
                type: "success"
            });
        }
        else{
            var errors = Object.values(result.errors);
            var error_messages = ''
      
            for (let e of errors){
              error_messages += e;
            }
            setReturned(error_messages)
            showMessage({
                message: error_messages,
                type: "danger"
            });
        }
    }


   if(loading){
       return (
        <View style={styles.container}>
            <ActivityIndicator />
        </View>
       )
   }
   else{
       //'Map' all workout models returned from the API onto cards that display all relevant information
       let works = workouts.reverse().map((val, key) => {

            let totalDuration = 0;
            val.exercises.forEach(e => {
                totalDuration = totalDuration + e.duration
            });
            let date = convertDate(val.workout.workoutCreated) 
           return(
               <View key={key}>
                   <Card key={key} style={styles.item} containerStyle={{backgroundColor: '#F1E0B0', borderColor: '#47504f', borderWidth: 2, borderRadius: 18,}}>
                       <Card.Title h4>{date} Workout</Card.Title>
                       <Card.Divider />
                       <Text style={styles.item_text}><MaterialCommunityIcons name='walk' size={20} /> Number of Activities: {val.exercises.length}</Text>
                       <Text style={styles.item_text}><MaterialCommunityIcons name='clock-outline' size={20} /> Total Duration: {totalDuration} minutes</Text>
                       <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
                            <Button title="Add Activities" color={'#18a4bc'} onPress={() =>{setCurrentWorkout(val); toggleCreate()}} />
                            <Button title="More Details" color={'#f8ac4c'} onPress={() => {setCurrentWorkout(val); toggleDetails()}} />
                            <Button title="Delete Workout" color={'#FF6961'} onPress={() => deleteConfirm(val)} />
                       </View>
                   </Card>
               </View>
           )
       })

    //Alters the welcome message phrases based on the when/if the user has completed their last workout
    let last;
    try{
        last = ("Your last workout was on " +  convertDate(workouts[0].workout.workoutCreated) + ", why not add a new one now?")
    }
    catch (e){
        last = "You don't currently have any workouts, why not add one now?"
    }
    return (
        
        <View style={styles.container}>
            <Appbar.Header style={styles.workout_header}>
                <Appbar.Action icon="plus" accessibiltyLevel onPress={() => setDatePicker()} />
                <Appbar.Content title="Workouts" />
            </Appbar.Header>

            <ScrollView style={styles.scrolling}>
                <Card containerStyle={{backgroundColor: '#b0dcac', borderColor: '#47504f', borderWidth: 2, }}>
                    <Card.Title style={{color: '#47504f'}} h3>Been Busy?</Card.Title>
                    <Card.Divider color='#47504f' />
                    <Text style={styles.greeting_text}>{last}</Text>
                    <Button title="Create" color={'#28b44c'} onPress={() => setDatePicker()} ></Button>
                </Card>
                {works}
            </ScrollView>

            <Overlay isVisible={detailsVisible} fullScreen overlayStyle={{backgroundColor: '#d8ecac'}} >
                <Details current={currentWorkout} />
                <View style={{marginTop: 30}}>
                    <Button color={'#FF6961'} onPress={() => toggleDetails()} title={"Go Back"} />
                </View>
            </Overlay>

            <Overlay isVisible={createVisible} fullScreen overlayStyle={{backgroundColor: '#d8ecac'}} >
                <Create current={currentWorkout} user={user} />
                <View style={{marginTop: 30}}>
                    <Button color={'#FF6961'} onPress={() => setCreateVisible(false)} title={"Go Back"} />
                </View>
            </Overlay>

            <DateTimePickerModal isVisible={datePickerVisible} mode="date" onConfirm={(date) => {setDatePicker(); sendWorkout(date)}} onCancel={() => setDatePicker()} />
            
        </View>
    )
   }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d8ecac'
        //padding: 8,
      },
      item: {
        flexDirection: 'row',
        borderRadius: 80,
        height: 150,
    },
    scrolling: {
        width: Dimensions.get('window').width,
    },
    item_text: {
        fontSize: 18,
        marginVertical: 6,
        textAlign: 'center'
    },
    greeting_text: {
        fontSize: 18,
        marginVertical: 6,
        textAlign: 'center',
        color: '#47504f'
    },
    overlay:{
        backgroundColor: 'green',
    },
    workout_header: {
        flexDirection: 'row', 
        backgroundColor: '#ACDEAA', 
        justifyContent: 'center',
        padding: 8,
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
})

export default Workouts