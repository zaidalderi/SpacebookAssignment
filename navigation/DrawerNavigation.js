import React, {Component} from "react";
import {CreateDrawerNavigation, createDrawerNavigator} from '@react-navigation/drawer';
import {ContactStackNavigator, FriendsNavigator, LoginSignupNavigator} from './StackNavigator';
import TabNavigator from './TabNavigator';

import LoginScreen from "../screens/login";
import Friends from "../screens/friends";
import FriendSearch from "../screens/Friendsearch";
import LogoutScreen from "../screens/logout";


const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
    render (){
        return(
            <Drawer.Navigator>
                <Drawer.Screen name = "Login" component={LoginSignupNavigator}/>
                <Drawer.Screen name = "Home" component={TabNavigator}/>
                <Drawer.Screen name = "Logout" component={LogoutScreen}/>
            </Drawer.Navigator>
        );
    }
}

export default DrawerNavigator;
