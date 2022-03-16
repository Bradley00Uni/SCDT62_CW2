import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Card, Overlay, Header } from 'react-native-elements';
import {FontAwesome} from '@expo/vector-icons';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

//Attach to Overlay

const Details = () => {
    return (
        <View>
            <Text>Hello World</Text>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default Details