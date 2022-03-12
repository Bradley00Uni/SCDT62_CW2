import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay, Header } from 'react-native-elements';
import {FontAwesome} from '@expo/vector-icons';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Switch, Appbar } from 'react-native-paper';

import Create from './activity/create';

const Activities = () => {
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState(null);
    const [visible, setVisible] = useState(null);
    const [returned, setReturned] = useState('')

    const [isSwitchOn, setIsSwitchOn] = useState(false);

    useEffect(() => {
        //https://workoutapi20220309144340.azurewebsites.net
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

        let acts;
            acts = activities.map((val, key) => {
                if(!isSwitchOn){
                    return(
                        <View key={key}> 
                            <Card key={key} style={styles.item} containerStyle={{backgroundColor: '#daeaf6'}}>
                                <Card.Title h5>{val.name} ({val.type})</Card.Title>
                                <Card.Divider />
                                <View style={{textAlign: 'center',}}>
                                    <Text>{val.description}</Text>
                                </View>     
                            </Card>
                        </View>
                    )
                }
                else{
                    return(
                        <View key={key}>
                            <Card key={key} style={styles.item} containerStyle={{backgroundColor: '#FFC8A2'}}>
                                <Card.Title h5>Activity: {val.id}</Card.Title>
                                <Card.Divider />
                                <TextInput style={styles.input} placeholder={val.name}></TextInput>
                                <TextInput style={styles.input} placeholder={val.description}></TextInput>
                                <TextInput style={styles.input} placeholder={val.type}></TextInput>
                                <View style={{flexDirection: 'row', marginLeft: 90}}>
                                    <Button title="Update Activity" style={{justifyContent: 'flex-start'}} color="orange" />
                                    <FontAwesome.Button name='trash-o' style={{justifyContent: 'flex-end', backgroundColor: 'red'}} onPress={() => deleteActivity(val.id)} />
                                </View>
                            </Card>
                        </View>
                    )
                }
            })

       const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn)

        const TopBar= () => {
            return (
               <Appbar.Header style={{width: Dimensions.get('window').width, backgroundColor: '#ACDEAA'}}>
                   <Appbar.Action icon="plus" onPress={toggleOverlay} accessibiltyLevel />
                   <Appbar.Content title="Activities" subtitle={'Activities are used when creating a Workout'} />               
                   <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
               </Appbar.Header>
            )
        }
        
        const toggleOverlay = () => {
            setVisible(!visible);
        }

        const deleteActivity = async (id) => {
            let data = id;

            const response = await fetch(`https://workoutapi20220309144340.azurewebsites.net/api/activities/${data}`, {
                method: 'DELETE',
                body: data
            })
            let result = await response

            if(result){
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
                   <Appbar.Action icon="plus" onPress={toggleOverlay} accessibiltyLevel />
                   <Appbar.Content title="Activities" subtitle={'Activities are used when creating a Workout'} />               
                   <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
               </Appbar.Header>
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


