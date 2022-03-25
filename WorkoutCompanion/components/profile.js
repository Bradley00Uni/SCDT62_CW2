import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay } from 'react-native-elements';
import { Appbar } from 'react-native-paper';

const Profile = () => {

    return (
        <View style={styles.container}>
        <Text>Profile Page</Text>
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
