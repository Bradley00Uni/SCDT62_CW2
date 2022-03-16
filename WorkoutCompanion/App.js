import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Container } from 'react-native';
import { BottomNavigation, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Activities from './components/activities';
import Workouts from './components/workouts';

const HomeRoute = () => <Text>Home</Text>;
const ProfileRoute = () => <Text>Profile</Text>;

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'home', title: 'Home', icon: 'home', color: '#9cadce'},
    {key: 'activities', title: 'Activities', icon: 'walk', color: '#ACDEAA'},
    {key: 'workouts', title: 'Workouts', icon: 'routes-clock', color: '#FF968A'},
    {key: 'profile', title: 'Profile', icon: 'account', color: '#CBAACB'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    activities: Activities,
    workouts: Workouts,
    profile: ProfileRoute,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />  
  )
};