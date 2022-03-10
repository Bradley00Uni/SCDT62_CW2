import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Container } from 'react-native';
import { BottomNavigation, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Activities from './components/activities';

const HomeRoute = () => <Text>Home</Text>;
const WorkoutRoute = () => <Text>Workouts</Text>;
const ProfileRoute = () => <Text>Profile</Text>;

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'home', title: 'Home', icon: 'home'},
    {key: 'activities', title: 'Activities', icon: 'walk'},
    {key: 'workouts', title: 'Workouts', icon: 'routes-clock'},
    {key: 'profile', title: 'Profile', icon: 'account'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    activities: Activities,
    workouts: WorkoutRoute,
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