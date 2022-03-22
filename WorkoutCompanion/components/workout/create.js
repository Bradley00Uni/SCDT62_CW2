import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Dimensions, ScrollView, } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Card, Overlay } from 'react-native-elements';
import { MaterialCommunityIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const Create = (current) => {

    const [workout, setWorkout] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        return fetch(`https://workoutapi20220309144340.azurewebsites.net/api/workouts/${current.current.workout.id}`).then( (response) => response.json()).then( (responseJson) => {
            setWorkout(responseJson.workout)
            setLoading(false)

        })
        .catch((error) => {console.log(error)})
    })

    if((current != null) && (loading == false)){
        return (
            <View>
                <Text style={styles.title}>{workout.workoutCreated} Workout</Text>
            </View>
        )
    }
    else{
        return(<View></View>)
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