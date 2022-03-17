import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message'

class LogoutScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            token: ''
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });        
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null) {
          this.setState({token:value});
        }else{
            this.props.navigation.navigate("Login");
        }
    }

    logout = async () => {
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate("Login");
                showMessage({
                    message: "Logged out successfully",
                    type: 'success',
                    icon: 'success'
                  })
            }else if(response.status === 401){
                console.log('You are not logged in')
                showMessage({
                    message: "You are not logged in",
                    type: 'warning',
                    icon: 'warning'
                  })
                this.props.navigation.navigate("Login");
            }else{
                showMessage({
                    message: "Something went wrong!",
                    type: 'warning',
                    icon: 'warning'
                  })
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.logo}>Are you sure you want to logout?</Text>
                <TouchableOpacity style={styles.btn} onPress={() => this.logout()}>
                    <Text style={{color:'white'}}>Sure, Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate("Home")}>
                    <Text style={{color: 'white'}}>Go back</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default LogoutScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    btn:{
      width:"50%",
      backgroundColor:"#0096c7",
      borderRadius: 5,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:20,
      marginBottom:10,
    },
    logo:{
      fontSize:20,
      color:"black",
      marginBottom:40,
      fontWeight: 'bold'
      }
  });