import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay, Header } from 'react-native-elements';
import { Appbar } from 'react-native-paper';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import {FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';

import Details from './workout/details';

const Workouts = () => {
    const [workouts, setWorkouts] = useState(null);

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        return fetch('https://workoutapi20220309144340.azurewebsites.net/api/workouts').then( (response) => response.json()).then( (responseJson) => {
            setWorkouts(responseJson)
            setLoading(false)

        })
        .catch((error) => {console.log(error)})
    },)

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

    const WelcomeAlert = () => {
        let last = convertDate(workouts[workouts.length - 1].workout.workoutCreated)
        return (
            <Card containerStyle={{backgroundColor: '#f89c9c'}}>
                <Card.Title style={{color: 'white'}} h3>Been Busy?</Card.Title>
                <Card.Divider color='white' />
                <Text style={styles.greeting_text}>Your last workout was on {last.slice(0, -6)}, why not add a new one now?</Text>
                <Button title="Create" color={'#28b44c'} ></Button>
            </Card>
        )
    }



   if(loading){
       return (
        <View style={styles.container}>
            <ActivityIndicator />
        </View>
       )
   }
   else{
       let works = workouts.map((val, key) => {

            let totalDuration = 0;
            val.exercises.forEach(element => {
                totalDuration = totalDuration + element.duration
            });
            let date = convertDate(val.workout.workoutCreated) 
           return(
               <View key={key}>
                   <Card key={key} style={styles.item} containerStyle={{backgroundColor: '#F1E0B0'}}>
                       <Card.Title h4>{date}</Card.Title>
                       <Card.Divider />
                       <Text style={styles.item_text}><MaterialCommunityIcons name='walk' size={20} /> Number of Activities: {val.exercises.length}</Text>
                       <Text style={styles.item_text}><MaterialCommunityIcons name='clock-outline' size={20} /> Total Duration: {totalDuration} minutes</Text>
                       <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
                           <Button title="More Details" color={'#f06c64'} />
                           <Button title="Delete Workout" color={'#ff4034'} />
                           <FontAwesome.Button name='facebook' style={{backgroundColor: '#4864ac', paddingHorizontal: 20, }}>Share</FontAwesome.Button>
                       </View>
                   </Card>
               </View>
           )
       })

    return (
        <View style={styles.container}>
            <Appbar.Header style={{width: Dimensions.get('window').width, backgroundColor: '#f06c64'}}>
                <Appbar.Content title="Workouts" subtitle={'lorem ipsum'} />
            </Appbar.Header>
            <ScrollView style={styles.scrolling}>
                <WelcomeAlert />
                    {works}
                </ScrollView>
            <FlashMessage position="top" />
        </View>
    )
   }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //padding: 8,
      },
      item: {
        backgroundColor: 'green',
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
        color: 'white'
    },
})

export default Workouts