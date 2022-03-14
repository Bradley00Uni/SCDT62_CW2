import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert } from 'react-native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

const Edit = (activ) => {
    const [id, setId] = useState(activ.activ.id)
    const [name, setName] = useState(activ.activ.name);
    const [desc, setDesc] = useState(activ.activ.description);
    const [type, setType] = useState(activ.activ.type);

    const [returned, setReturned] = useState('')

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

    if(activ != null){
        return (
            <View>
                <TextInput style={styles.input} defaultValue={activ.activ.name} onChangeText={(name) => setName(name)} />
                <TextInput style={styles.input} defaultValue={activ.activ.description} onChangeText={(desc) => setDesc(desc)} />
                <TextInput style={styles.input} defaultValue={activ.activ.type} onChangeText={(type) => setType(type)} />

            <Button title="Save Changes" style={styles.input} onPress={() => sendData()} />

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

export default Edit