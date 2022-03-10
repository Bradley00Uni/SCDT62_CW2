import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

const Create = () => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');

    const data = [name, desc, type];
    const [returned, setReturned] = useState('')

    const sendData = async () => {
        let formdata = new FormData();
        formdata.append("name", name)
        formdata.append("description", desc)
        formdata.append("type", type)

        let data = {}

        formdata.forEach((value, key) => data[key] = value)

        const response = await fetch('https://localhost:7267/api/activities', {
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

    return (
        <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Activity Name" onChangeText={(name) => setName(name)} />
            <TextInput style={styles.input} placeholder="Description" onChangeText={(desc) => setDesc(desc)} />
            <TextInput style={styles.input} placeholder="Type" onChangeText={(type) => setType(type)} />

           <Button title="Create" style={styles.input} onPress={() => sendData(name)} />

           <FlashMessage position="top" />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      backgroundColor: 'white',
      marginLeft: 40,
      marginRight: 40,
      marginTop: 30,
      textAlign: 'center',
      borderRadius: 10,
    },
    form: {

    }
  });

  export default Create;