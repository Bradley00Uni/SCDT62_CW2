import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Dimensions, ScrollView, } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Card, Overlay } from 'react-native-elements';
import { MaterialCommunityIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const Create = () => {
    const [activities, setActivities] = useState(['','']);
    const [exercises, setExercises] = useState(null)
    const [loading, setLoading] = useState(true)
    const [returned, setReturned] = useState('')
    const [datePickerVisible, setDatePickerVisible] = useState(false)
    
    const [workoutID, setWorkoutID] = useState(null)
    const [chosenDuration, setChosenDuration] = useState(null);
    const [chosenDate, setChosenDate] = useState(null);

    const setDatePicker =() => {setDatePickerVisible(!datePickerVisible)}

    const getActivities= () => {
        return fetch('https://workoutapi20220309144340.azurewebsites.net/api/activities').then( (response) => response.json()).then( (responseJson) => {
            setActivities(responseJson)
            setLoading(false)

        })
        .catch((error) => {console.log(error)})
    }

    const sendWorkout = async () => {
        let data = {
            "workoutCreated" : chosenDate
        }

        const response = await fetch('https://workoutapi20220309144340.azurewebsites.net/api/workouts', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        let result = await response.json()

        if(response.status == 201){
            setReturned("Success")
            setWorkoutID(result.id)
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


    const addActivity = async (a) => {
        let data = {
            "activityID": a,
            "workoutID" : workoutID,
            "duration" : chosenDuration
        }
        const response = await fetch('https://workoutapi20220309144340.azurewebsites.net/api/exercises', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        let result = await response.json()

        if(response.status == 201){
            setReturned("Success")
            setExercises(exercises + result)
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

    if(loading){
        return (
            <View style={styles.container}>
                <Button title="Select Workout Date" onPress={() => setDatePicker()} />
                <DateTimePickerModal isVisible={datePickerVisible} mode="date" onConfirm={(date) => {setDatePicker(); setChosenDate(date)}} onCancel={() => setDatePicker()} />

                <Button title="Log Workout" onPress={() => {sendWorkout(); getActivities()}} />
            </View>
        )
    }
    else{
        let acts = activities.map((val, key) => {
            return (
                <Card style={styles.item} key={key}>
                    <Card.Title h5>{val.name}</Card.Title>
                    <Text>Type: {val.type}</Text>
                    <Text>Description: {val.description}</Text>
                    <TextInput style={styles.input} placeholder="Duration" onChangeText={(d) => setChosenDuration(d)} />
                    <Button title="Add Workout" onPress={() => addActivity(val.id)} />
                </Card>
            )
        })

        let dateOutput = JSON.stringify(chosenDate)
        dateOutput = dateOutput.substring(1, 11)
        return (
            <View>
                <Text style={styles.title}>{dateOutput} Workout </Text>
                {acts}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        //padding: 8,
        backgroundColor: 'transparent'
      },
    input: {
        height: 40,
        backgroundColor: 'white',
        marginLeft: 40,
        marginRight: 40,
        marginTop: 15,
        textAlign: 'center',
        borderRadius: 10,
      },
      title: {
        fontSize: 40
    },
    subtitle: {
        fontSize: 30,
        textDecorationLine: 'underline'
    },
    scrolling: {
        width: Dimensions.get('window').width / 1.2,
    },
    item: {
        flexDirection: 'row',
        borderRadius: 80,
        height: 150,
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10
      },
})

export default Create