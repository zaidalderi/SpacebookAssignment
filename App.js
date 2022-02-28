import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MainStackNavigator } from "./navigation/StackNavigator";

import DrawerNavigator from "./navigation/DrawerNavigation";

import HomeScreen from './screens/home';
import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';
import LogoutScreen from './screens/logout';
import Profile from './screens/profile';
import Friends from './screens/friends';
import NewPost from './screens/newpost';
import FriendSearch from './screens/friendsearch';
import UpdateProfile from './screens/updateprofile';

const Drawer = createDrawerNavigator();



class App extends Component{
    
    render(){
        return (
            <NavigationContainer>
                <DrawerNavigator/>
            </NavigationContainer>
        );
    }
}

export default App;