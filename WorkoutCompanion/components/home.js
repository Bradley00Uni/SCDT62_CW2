import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Appbar } from 'react-native-paper';

const Home = () => {

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Welcome to WorkoutCompanion</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fac898'
      },
    title: {
        fontSize: 25,
        textAlign: 'center'
    },
})

export default Home