import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainStackNavigator, ContactStackNavigator, ProfileStackNavigator, SearchNavigator, FriendsNavigator,HomeScreenNavigator } from "./StackNavigator";
import { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from "../screens/home";
import NewPost from "../screens/newpost";

const Tab = createBottomTabNavigator();

class BottomTabNavigator extends Component {
    render(){
        return(
            <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
    
                  if (route.name === 'Home') {
                    iconName = focused
                      ? 'home'
                      : 'home-outline';
                  } else if (route.name === 'Search') {
                    iconName = focused 
                      ? 'search' 
                      : 'search-outline';
                  } else if (route.name === 'New Post') {
                      iconName = focused
                      ? 'add'
                      : 'add-outline';
                  } else if (route.name == 'Profile') {
                      iconName = focused
                      ? 'person'
                      : 'person-outline';
                  } else if (route.name == 'Friends'){
                      iconName = focused
                      ? 'people'
                      : 'people-outline';
                  }
    
                  // You can return any component that you like here!
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0096c7',
                tabBarInactiveTintColor: 'gray',
              })}
            >
                <Tab.Screen name = "Home" component = {HomeScreenNavigator}/>
                <Tab.Screen name = "Search" component = {SearchNavigator}/>
                <Tab.Screen name = "New Post" component = {NewPost}/>
                <Tab.Screen name = "Profile" component = {ProfileStackNavigator}/>
                <Tab.Screen name = "Friends" component = {FriendsNavigator}/>
            </Tab.Navigator>
        );
    }
}

export default BottomTabNavigator;