import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Dimensions, ScrollView, } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Card, Overlay } from 'react-native-elements';
import { MaterialCommunityIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const Create = (current) => {

    const [workout, setWorkout] = useState(current.current.workout)
    const [exercises, setExercises] = useState(current.current.exercises)
    const [activities, setActivities] = useState(null)

    const [user, setUser] = useState(current.user)

    const [loading, setLoading] = useState(true)
    const [returned, setReturned] = useState('')

    const [chosenDuration, setChosenDuration] = useState(null)


    useEffect(() => {
        //Fetches all activities registered to the current user so they can be used in Exercise creation
        return fetch(`https://workoutapi20220309144340.azurewebsites.net/api/activities/user/${user}`).then( (r) => r.json()).then( (rj) => {
            setActivities(rj)
            setLoading(false)

        })
        .catch((error) => {console.log(error)})
    }, [])

    const getExercises = () => {
        //Fetches the data related to the current workout, allowing the list of exercises etc. to update dynamically
        return fetch(`https://workoutapi20220309144340.azurewebsites.net/api/workouts/${workout.id}`).then( (r) => r.json()).then( (rj) => {
            setExercises(rj.exercises)

        })
        .catch((error) => {console.log(error)})
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

    //Function used to add a new exercise model to the database, populating it with the selected activity model, entered duration and ID of the current workout
    const addActivity = async (a) => {
        let data = {
            "activityID": a,
            "workoutID" : workout.id,
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
            getExercises()
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

    //Only renders if all nessecary data is present
    if((current != null) && (loading == false)){

        //Maps all returned activities onto Cards that contain relevant information. Each also hosts an input that can be used to enter a duration and create and Exercise Model
        let acts = activities.map((val, key) => {
            return (
                <Card style={styles.item} key={key} containerStyle={{backgroundColor: '#ccf6e0', borderColor: '#47504f', borderWidth: 1, borderRadius: 15,}}>
                    <Card.Title h5>{val.name} ({val.type})</Card.Title>
                    <Text style={{textAlign: 'center'}}>{val.description}</Text>
                    <TextInput style={styles.input} placeholder="Duration" keyboardType='numeric' onChangeText={(d) => setChosenDuration(d)} />
                    <View style={{width: 200, marginLeft: 60}}>
                    <Button title="Add Workout" color={'#28b44c'} onPress={() => addActivity(val.id)} />
                    </View>
                </Card>
            )
        })

        //Maps all exercise models assosciated with the current workout, updates dynamically so after new ones are created, the list is updated without the need to exit the component
        let exercs = exercises.map((e) => {
            return (
                <Card key={e.id} style={styles.item} containerStyle={{backgroundColor: '#ccf6e0', borderColor: '#47504f', borderWidth: 1, borderRadius: 15,}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{e.activity.name}</Text>
                        <Text style={{fontSize: 16,}}><Entypo name='stopwatch' size={14} /> Duration: {e.duration} minutes</Text>
                    </View>
                </Card>
            )
        })

        //All content is returned within a Scrollview component, meaning as the number of activities/exercises increase, the content displayed to the user is not hindered
        return (
            <ScrollView>
                <Text style={styles.title}>{convertDate(workout.workoutCreated)} Workout</Text>
                <Text style={styles.subtitle}>Current Activities</Text>
                <Text style={{textAlign: 'center'}}>These are the activities already registered to this workout</Text>
                {exercs}
                <Text style={styles.subtitle}>Add a New Activity</Text>
                <Text style={{textAlign: 'center'}}>Enter a Duration to add the Activity to the Workout</Text>
                {acts}
            </ScrollView>
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
        marginBottom: 15,
        textAlign: 'center',
        borderColor: '#47504f', 
        borderWidth: 1, 
        borderRadius: 15
      },
      title: {
        fontSize: 30,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 22,
        textDecorationLine: 'underline',
        textAlign: 'center',
        marginTop: 20,
    },
    scrolling: {
        width: Dimensions.get('window').width / 1.2,
    },
    item: {
        flexDirection: 'row',
        borderRadius: 80,
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10
      },
})

export default Create