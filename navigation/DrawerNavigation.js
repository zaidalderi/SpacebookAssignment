import React, { Component } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { LoginSignupNavigator } from './StackNavigator'
import TabNavigator from './TabNavigator'
import LogoutScreen from '../screens/logout'

const Drawer = createDrawerNavigator()

class DrawerNavigator extends Component {
  render () {
    return (
      <Drawer.Navigator>
        <Drawer.Screen name='Login' component={LoginSignupNavigator} />
        <Drawer.Screen name='Home' component={TabNavigator} />
        <Drawer.Screen name='Logout' component={LogoutScreen} />
      </Drawer.Navigator>
    )
  }
}

export default DrawerNavigator
