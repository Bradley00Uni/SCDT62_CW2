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
           return(
               <View key={key}>
                   <Card key={key} style={styles.item} containerStyle={{backgroundColor: '#F1E0B0'}}>
                       <Card.Title h5>{val.workout.workoutCreated}</Card.Title>
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
})

export default Workouts