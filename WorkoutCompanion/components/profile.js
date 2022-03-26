import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay } from 'react-native-elements';
import { Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Restart} from 'fiction-expo-restart';

const Profile = () => {

    const STORAGE_TOKEN = '@token'

    const logoutConfirm = () => {
        return (
          <>
          {Alert.alert(
            "Are you sure?",
            "Are you sure you want to Logout?",
            [
                {text: "Yes", onPress: () => {logout()}}, {text: "No", onPress: () => {setIndex(0)}}
            ]
          )}
          </>
        )
      }
    
    const logout = async () => {
        let response = await fetch('https://workoutapi20220309144340.azurewebsites.net/api/auth/Logout', {
        method: 'POST',
        })
        let result = response.json()
    
        if(response.status == 200){
            console.log("Logged Out")
            await AsyncStorage.removeItem(STORAGE_TOKEN)
            Restart()
        }
    }

    

    return (
        <View style={styles.container}>
        <Text>Profile Page</Text>
        <Button title='Logout' onPress={() => logoutConfirm()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BEA9DF'
      },
})

export default Profile
