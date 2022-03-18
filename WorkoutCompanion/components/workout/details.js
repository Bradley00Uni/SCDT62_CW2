import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, FlatList } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Card, Overlay } from 'react-native-elements';
import {FontAwesome} from '@expo/vector-icons';

const Details = (current) => {

    const [workout, setWorkout] = useState(current.current.workout)
    const [exercises, setExercises] = useState(current.current.exercises)

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

    let exercs = exercises.map((e) => {
        return (
            <Card key={e.id} style={styles.item} containerStyle={{backgroundColor: '#80c4ac'}}>
                <Card.Title h5>{e.activity.name}</Card.Title>
                <Card.Divider />
                <Text>Duration: {e.duration} minutes</Text>
            </Card>
        )
    })

    if(current != null){
        return (
            <View style={styles.container}>
                <Text>{convertDate(workout.workoutCreated)}</Text>
                {exercs}
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
      },
    item: {
        flexDirection: 'row',
        borderRadius: 80,
        height: 150,
    },
})

export default Details