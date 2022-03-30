import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, ScrollView, Dimensions } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Card, Overlay } from 'react-native-elements';
import { MaterialCommunityIcons, Entypo, FontAwesome } from '@expo/vector-icons';

//Main function returned by details.js
const Details = (current) => {

    const [workout, setWorkout] = useState(current.current.workout)
    const [exercises, setExercises] = useState(current.current.exercises)

    //Function used to convert the time from the current workout's datetime to a more readable format
    const convertTime = (date) => {
        var time = date.toString()
        var fullTime = time.substring(11, 16)

        var hour = Number(fullTime.substring(0,2))

        if(hour >= 0 && hour < 11){fullTime = fullTime + " AM"}
        else{fullTime = fullTime + " PM"}

        return fullTime

    }

    //Converts the datetime stored for the workout into a more traditional format, that is easier to read for users
    const convertDate =(date) => {

        var newDate = date.toString()
        var year = newDate.substring(0,4)
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
        newDate = month + " " + day + ", " + year
        return newDate
    }

    //Maps all exercise models assosciated with the current workout; updates dynamically.
    let exercs = exercises.map((e) => {
        return (
            <Card key={e.id} style={styles.item} containerStyle={{backgroundColor: '#ACDEAA', borderColor: '#47504f', borderWidth: 2, borderRadius: 18,}}>
                <Card.Title h5 style={{fontSize: 18}}>{e.activity.name}</Card.Title>
                <Card.Divider color='black' />
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Text style={{fontSize: 16,}}><Entypo name='stopwatch' size={14} /> Duration: {e.duration} minutes</Text>
                    <Text style={{fontSize:15}}>Type: {e.activity.type}</Text>
                </View>
            </Card>
        )
    })

    //Only renders if a Workout has been passed
    if(current != null){
        let totalDuration = 0;
        exercises.forEach(d => {
            totalDuration = totalDuration + d.duration
        });

        return (
            <View style={styles.container}>
                    <Text style={styles.title}><MaterialCommunityIcons name='weight-lifter' size={40} /> Workout Details</Text>
                <View style={styles.details}>
                    <Text style={styles.detail_text}><MaterialCommunityIcons name='calendar' size={15} /> Date: {convertDate(workout.workoutCreated)}</Text>
                    <Text style={styles.detail_text}><MaterialCommunityIcons name='clock-time-eight-outline' size={15} /> Recorded: {convertTime(workout.workoutCreated)}</Text>
                    <Text style={styles.detail_text}><MaterialCommunityIcons name='walk' size={15} /> Number of Activities: {exercises.length}</Text>
                    <Text style={styles.detail_text}><Entypo name='stopwatch' size={15} /> Total Duration: {totalDuration} Minutes</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons name='walk' size={25} />
                    <Text style={styles.subtitle}>Activity Breakdown</Text>
                </View>
                <ScrollView style={styles.scrolling} persistentScrollbar>
                    {exercs}
                </ScrollView>

            </View>
        )
    }
    else{
        return (
            
            <View></View>
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
    item: {
        flexDirection: 'row',
        borderRadius: 80,
        height: 150,
    },
    title: {
        fontSize: 40
    },
    subtitle: {
        fontSize: 30,
        textDecorationLine: 'underline'
    },
    scrolling: {
        width: (Dimensions.get('window').width) - 50,
        height: (Dimensions.get('window').height) /1.48
    },
    details: {
        backgroundColor: '#F1E0B0',
        width: (Dimensions.get('window').width) - 50,
        justifyContent: 'center',
        textAlign: 'center',
        alignContent: 'center',
        padding: 10,
        borderColor: '#47504f',
        borderWidth: 2,
        borderRadius: 18,
    },
    detail_text: {
        fontSize: 18,
    }
})

export default Details