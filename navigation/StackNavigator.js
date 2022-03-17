import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Profile from '../screens/Profile'
import UpdateProfile from '../screens/UpdateProfile'
import ExpandPost from '../screens/ExpandPost'
import EditPost from '../screens/EditPost'
import FriendSearch from '../screens/Friendsearch'
import SignupScreen from '../screens/signup'
import Friends from '../screens/friends'
import FriendRequests from '../screens/Requests'
import LoginScreen from '../screens/login'
import FriendProfile from '../screens/friendprofile'
import HomeScreen from '../screens/home'
import CameraApp from '../screens/CameraApp'
import FriendWallPost from '../screens/friendWallPost'

const Stack = createStackNavigator()

class LoginSignupNavigator extends Component {
  render () {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Sign in' component={LoginScreen} />
        <Stack.Screen name='Sign up' component={SignupScreen} />
      </Stack.Navigator>
    )
  }
}

class HomeScreenNavigator extends Component {
  render () {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={HomeScreen} />
      </Stack.Navigator>
    )
  }
}

class ProfileStackNavigator extends Component {
  render () {
    return (
      <Stack.Navigator>
        <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name='Update Profile' component={UpdateProfile} options={{ title: false }} />
        <Stack.Screen name='Expand Post' component={ExpandPost} options={{ title: false }} />
        <Stack.Screen name='Edit Post' component={EditPost} options={{ title: false }} />
        <Stack.Screen name='Camera' component={CameraApp} options={{ title: false }} />
      </Stack.Navigator>
    )
  }
}

class SearchNavigator extends Component {
  render () {
    return (
      <Stack.Navigator>
        <Stack.Screen name='Search' component={FriendSearch} options={{ headerShown: false }} />
        <Stack.Screen name='Friend Profile' component={FriendProfile} options={{ title: false }} />
      </Stack.Navigator>
    )
  }
}

class FriendsNavigator extends Component {
  render () {
    return (
      <Stack.Navigator>
        <Stack.Screen name='Friend' component={Friends} options={{ headerShown: false }} />
        <Stack.Screen name='Friend Requests' component={FriendRequests} options={{ title: false }} />
        <Stack.Screen name='Friend Profile' component={FriendProfile} options={{ title: false }} />
        <Stack.Screen name='Friend Wall Post' component={FriendWallPost} />
        <Stack.Screen name='Expand Post' component={ExpandPost} options={{ title: false }} />
        <Stack.Screen name="Friend's Friends" component={Friends} options={{ title: false }} />
      </Stack.Navigator>
    )
  }
}

export { SearchNavigator, ProfileStackNavigator, FriendsNavigator, LoginSignupNavigator, HomeScreenNavigator }
