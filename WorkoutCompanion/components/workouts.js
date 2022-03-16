import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay, Header } from 'react-native-elements';
import { Appbar } from 'react-native-paper';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

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

        switch (month) {
            case "01":
                month = "January";
                break;
            case "02":
                month = "February";
                break;
            case "03":
                month = "March";
                break;
            case "04":
                month = "April";
                break;
            case "05":
                month = "May";
                break;
            case "06":
                month = "June";
                break;
            case "07":
                month = "July";
                break;
            case "08":
                month = "August";
                break;
            case "09":
                month = "September";
                break;
            case "10":
                month = "October";
                break;
            case "11":
                month = "November";
                break;
            case "12":
                month = "December";
                break;
        }

        newDate = day + " " + month + " " + year

        return newDate
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
                       <Card.Title h5>{date}</Card.Title>
                       <Card.Divider />
                       <Text>Number of Activities: {val.exercises.length}</Text>
                       <Text>Total Duration: {totalDuration}</Text>
                   </Card>
               </View>
           )
       })

    return (
        <View style={styles.container}>
            <Appbar.Header style={{width: Dimensions.get('window').width, backgroundColor: '#FF968A'}}>
                <Appbar.Content title="Workouts" subtitle={'lorem ipsum'} />
            </Appbar.Header>
            <ScrollView style={styles.scrolling}>
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
        borderRadius: 80
    },
    scrolling: {
        width: Dimensions.get('window').width,
    },
})

export default Workouts