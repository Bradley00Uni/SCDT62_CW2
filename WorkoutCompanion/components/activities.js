import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay } from 'react-native-elements';
import {FontAwesome} from '@expo/vector-icons';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import Create from './activity/create';

const Activities = () => {
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState(null);
    const [visible, setVisible] = useState(null);
    const [returned, setReturned] = useState('')

    useEffect(() => {
        //https://workoutapi20220309144340.azurewebsites.net
        return fetch('https://localhost:7267/api/activities').then( (response) => response.json()).then( (responseJson) => {
            setActivities(responseJson)
            setLoading(false)
        })
        .catch((error) => {console.log(error)})

    },)

    if (loading){
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        )
    }
    else{

        let acts = activities.map((val, key) => {
            return(
                <View key={key}> 
                    <Card key={key} style={styles.item} containerStyle={{backgroundColor: '#daeaf6'}}>
                        <Card.Title h5>{val.name} ({val.type})</Card.Title>
                        <Card.Divider />
                        <View style={{justifyContent: 'flex-start'}}>
                            <Text>{val.description}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <FontAwesome.Button name='trash-o' style={{justifyContent: 'flex-end', backgroundColor: 'red'}} onPress={() => deleteActivity(val.id)} />
                        </View>        
                    </Card>
                </View>
            )
        })

        const TopBar= () => {
            return (
                <View>
                    <Button title="Create New" onPress={toggleOverlay} />
                </View>
            )
        }
        
        const toggleOverlay = () => {
            setVisible(!visible);
        }

        const deleteActivity = async (id) => {
            let data = id;

            const response = await fetch(`https://localhost:7267/api/activities/${data}`, {
                method: 'DELETE',
            })
            let result = await response.json()

            if(response.status == 201){
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

        return (
            <View style={styles.container}>
                <TopBar />
                <Overlay isVisible={visible} onBackdropPress={toggleOverlay}><Create /></Overlay>
                <ScrollView style={styles.scrolling}>
                    {acts}
                </ScrollView>


                <FlashMessage position="top" />
            </View>
        )
    }
    
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
    },
    header: {
      fontSize: 36,
      fontFamily: 'Arial',
      color: 'white',
      textAlign: 'center',
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
    item: {
        backgroundColor: 'green',
        flexDirection: 'row',
        borderRadius: 80
    },
    scrolling: {
        width: Dimensions.get('window').width,
    },
  });

export default Activities;


