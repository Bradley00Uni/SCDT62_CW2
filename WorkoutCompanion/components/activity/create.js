import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ScrollView, Dimensions } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

//Main content returned by create.js
const Create = (params) => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [user, setUser] = useState(params.params)

    const data = [name, desc, type];
    const [returned, setReturned] = useState('')

    //Sends the data entered within the form to add a new activity model to the database
    //Additionally includes the current user's ID to ensure it remains attached to the right account
    const sendData = async () => {

        let data = {
            "name": name,
            "description": desc,
            "type": type,
            "userid" : user
       }

        const response = await fetch('https://workoutapi20220309144340.azurewebsites.net/api/activities', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        let result = await response.json()

        if(response.status == 201){
            setReturned("Success")
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
    };

    //Displays the Form over the top of the Activity screen, can be closed using button in activities.js component or by pressing off the form
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a New Activity</Text>
            <TextInput style={styles.input} placeholder="Activity Name" onChangeText={(name) => setName(name)} />
            <TextInput style={styles.input} placeholder="Description" onChangeText={(desc) => setDesc(desc)} />
            <TextInput style={styles.input} placeholder="Type" onChangeText={(type) => setType(type)} />

            <View style={styles.inputButton}>
                <Button title="Create" style={styles.input} color={'#18a4bc'} onPress={() => sendData(name)} />
           </View>

           <FlashMessage position="top" />
        </View>
    )
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

  export default Create;