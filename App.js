import 'react-native-gesture-handler'
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import DrawerNavigator from './navigation/DrawerNavigation'
import FlashMessage from 'react-native-flash-message'

class App extends Component {
  render () {
    return (
      <NavigationContainer>
        <FlashMessage position='top' icon={{ icon: 'warning' }} style={{ paddingTop: 0, backgroundColor: '#0096c7' }} />
        <DrawerNavigator />
      </NavigationContainer>
    )
  }
}

export default App
