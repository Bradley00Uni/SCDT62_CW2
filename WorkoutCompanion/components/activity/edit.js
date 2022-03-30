import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

//Main content returned by edit.js
const Edit = (activ) => {
    const [id, setId] = useState(activ.activ.id)
    const [name, setName] = useState(activ.activ.name);
    const [desc, setDesc] = useState(activ.activ.description);
    const [type, setType] = useState(activ.activ.type);

    const [returned, setReturned] = useState('')

    //Sends the altered values to the API route for the selected activity model. Will override all values if changed, but keep the original ID and userID
    const sendData = async () => {
        let data = {
             "id": id,
             "name": name,
             "description": desc,
             "type": type
        }

        const response = await fetch(`https://workoutapi20220309144340.azurewebsites.net/api/activities/${data.id}`, {
                    method: 'PUT',
                    body: (JSON.stringify(data)),
                    headers: {
                        'Content-Type': 'application/json',
                      },
        })
        let result = await response

        if(result.status == 204){
            setReturned("Success")
            showMessage({
                message: "Activity Edited",
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

    //Displays the Form over the top of the Activity screen, can be closed using button in activities.js component or by pressing off the form
    //Only renders content if an activity is selected
    if(activ != null){
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Edit This Activity</Text>
                <TextInput style={styles.input} defaultValue={activ.activ.name} onChangeText={(name) => setName(name)} />
                <TextInput style={styles.input} defaultValue={activ.activ.description} onChangeText={(desc) => setDesc(desc)} />
                <TextInput style={styles.input} defaultValue={activ.activ.type} onChangeText={(type) => setType(type)} />

                <View style={styles.inputButton}>
                    <Button title="Save Changes" color={'orange'} style={styles.input} onPress={() => sendData()} />
                </View>

            <FlashMessage position="top" />
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
    input: {
        height: 50,
        backgroundColor: 'white',
        marginLeft: 40,
        marginRight: 40,
        marginTop: 15,
        marginBottom: 15,
        textAlign: 'center',
        borderColor: '#47504f', 
        borderWidth: 2, 
        borderRadius: 15,
        width: 300,
    },
    inputButton: {
        width: 280,
        marginBottom: 20,
        marginTop: 5
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
  });

export default Edit