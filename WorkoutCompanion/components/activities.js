import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay, Header } from 'react-native-elements';
import {FontAwesome} from '@expo/vector-icons';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Appbar } from 'react-native-paper';

import Create from './activity/create';
import Edit from './activity/edit';

const Activities = () => {
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState(null);
    const [createVisible, setCreateVisible] = useState(null);
    const [editVisible, setEditVisible] = useState(null);
    const [returned, setReturned] = useState('')

    const [toEdit, setToEdit] = useState(null)
    
    useEffect(() => {
        return fetch('https://workoutapi20220309144340.azurewebsites.net/api/activities').then( (response) => response.json()).then( (responseJson) => {
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
                                <View style={{textAlign: 'center', justifyContent: 'flex-start'}}>
                                    <Text>{val.description}</Text>
                                </View>     
                                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                    <FontAwesome.Button name='pencil' style={{justifyContent: 'flex-start', backgroundColor: 'orange'}} onPress={() => {setToEdit(val); setEditVisible(true);}} />
                                    <FontAwesome.Button name='trash-o' style={{justifyContent: 'flex-end', backgroundColor: 'red'}} onPress={() => deleteConfirm(val)} />
                                </View>
                            </Card>
                        </View>
                    )
            })
        
        const toggleCreate = () => {
            setCreateVisible(!createVisible)
        }

        const toggleEdit = () => {
            setEditVisible(false)
        }

        const deleteConfirm = (val) => {
            return Alert.alert(
                "Are you sure?",
                `Are you sure you want to delete Activity '${val.name}'?`,
                [
                    {text: "Yes", onPress: () => {deleteActivity(val.id);}}, {text: "No"}
                ]
            )
        }

        const deleteActivity = async (id) => {
            let data = id;

            const response = await fetch(`https://workoutapi20220309144340.azurewebsites.net/api/activities/${data}`, {
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

        return (
            <View style={styles.container}>
                <Appbar.Header style={{width: Dimensions.get('window').width, backgroundColor: '#ACDEAA'}}>
                   <Appbar.Action icon="plus" onPress={toggleCreate} accessibiltyLevel />
                   <Appbar.Content title="Activities" subtitle={'Activities are used when creating a Workout'} />               
               </Appbar.Header>
                <Overlay isVisible={createVisible} onBackdropPress={toggleCreate}><Create /></Overlay>
                <Overlay isVisible={editVisible} onBackdropPress={toggleEdit} ><Edit activ={toEdit} /></Overlay>
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
      //padding: 8,
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
      marginBottom: 15,
      textAlign: 'center',
      borderRadius: 10,
    },
    input_multi: {
        height: 60,
        backgroundColor: 'white',
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 15,
        textAlign: 'center',
        borderRadius: 10,
      },
    item: {
        backgroundColor: 'green',
        flexDirection: 'row',
        borderRadius: 80
    },
    activity_header: {
        flexDirection: 'row', 
        backgroundColor: 'red', 
        justifyContent: 'center',
        padding: 8,
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
    scrolling: {
        width: Dimensions.get('window').width,
    },
  });

export default Activities;


