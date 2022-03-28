import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay, Header } from 'react-native-elements';
import {FontAwesome} from '@expo/vector-icons';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'

import Create from './activity/create';
import Edit from './activity/edit';

const Activities = () => {
    const STORAGE_USER = '@user'

    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState(null);
    const [createVisible, setCreateVisible] = useState(null);
    const [editVisible, setEditVisible] = useState(null);
    const [returned, setReturned] = useState('')

    const [user, setUser] = useState(null)

    const [toEdit, setToEdit] = useState(null)
    
    useEffect(() => {
        getUser()
        return fetch(`https://workoutapi20220309144340.azurewebsites.net/api/activities/user/${user}`).then( (response) => response.json()).then( (responseJson) => {
            setActivities(responseJson)
            setLoading(false)

        })
        .catch((error) => {console.log(error)})

    },)

    const getUser = async () => {
        const id = await AsyncStorage.getItem(STORAGE_USER)
        setUser(id)
    }

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
                            <Card key={key} style={styles.item} containerStyle={styles.itemContainer}>
                                <Card.Title h4>{val.name} ({val.type})</Card.Title>
                                <Card.Divider />
                                <View style={{textAlign: 'center', justifyContent: 'flex-start'}}>
                                    <Text style={{fontSize: 16}}>Description: {val.description}</Text>
                                </View>     
                                <View style={{justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 20}}>
                                    <Button title="Edit Activity" color={'orange'} onPress={() => {setToEdit(val); setEditVisible(true);}} />
                                    <Button title="Delete Activity" color={'#ff4034'} onPress={() => deleteConfirm(val)} />
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
                <Appbar.Header style={{width: Dimensions.get('window').width, backgroundColor: '#f06c64'}}>
                   <Appbar.Action icon="plus" onPress={toggleCreate} accessibiltyLevel />
                   <Appbar.Content title="Activities" subtitle={'Activities are used when creating a Workout'} />               
               </Appbar.Header>
                <Overlay isVisible={createVisible} onBackdropPress={toggleCreate} overlayStyle={{backgroundColor: '#f8c4c4', borderColor: '#47504f', borderWidth: 2, borderRadius: 15,}}>
                    <Create params={user} />
                    <View style={{marginTop: 30}}>
                        <Button color={'#FF6961'} onPress={() => toggleCreate()} title={"Go Back"} />
                    </View>
                </Overlay>
                <Overlay isVisible={editVisible} onBackdropPress={toggleEdit} overlayStyle={{backgroundColor: '#f8c4c4', borderColor: '#47504f', borderWidth: 2, borderRadius: 15,}} >
                    <Edit activ={toEdit} />
                    <View style={{marginTop: 30}}>
                        <Button color={'#FF6961'} onPress={() => toggleEdit()} title={"Go Back"} />
                    </View>
                </Overlay>
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
      backgroundColor: '#f8c4c4'
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
    itemContainer: {
        backgroundColor: '#fffcf4', 
        borderColor: '#47504f', 
        borderWidth: 2, 
        borderRadius: 16,
    },
  });

export default Activities;


