import React, { Component } from 'react';
import { View,Button, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


class LoginScreen extends Component{
    
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }

    login = async () => {

        //Validation here...

        return fetch("http://localhost:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    email: this.state.email,
                    password: this.state.password
                }
            )
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Invalid email or password';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token);
                await AsyncStorage.setItem('@userID',responseJson.id);
                this.props.navigation.navigate("Home");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render(){
        return (
            // <View style={{alignContent: 'center', justifyContent: 'center'}}>
            //     <TextInput
            //         placeholder="Enter your email..."
            //         onChangeText={(email) => this.setState({email})}
            //         value={this.state.email}
            //         style={{alignContent: 'center',textAlign: 'center',padding:5, borderWidth:1, margin:5, borderRadius: 30}}
            //     />
            //     <TextInput
            //         placeholder="Enter your password..."
            //         onChangeText={(password) => this.setState({password})}
            //         value={this.state.password}
            //         secureTextEntry
            //         style={{alignContent: 'center',textAlign: 'center',padding:5, borderWidth:1, margin:5, borderRadius: 30}}
            //     />
            //     <Button
            //         title="Login"
            //         onPress={() => this.login()}
            //         style = {{alignItems: 'center',justifyContent: 'center',borderRadius: 25,width: "80%"}}
            //     />
            //     <Button
            //         title="Don't have an account?"
            //         color="darkblue"
            //         onPress={() => this.props.navigation.navigate("Sign up")}
            //         style = {{alignItems: 'center',justifyContent: 'center',borderRadius: 25, width: "80%",padding: 20}}
            //     />
            // </View>

            <View style={styles.container}>
                <Text style={styles.logo}>Spacebook</Text>
                <View>
                {/* <Image style={{width: 200, height: 50}} source={require('../screens/SpacebookLogo.png')}/> */}
                </View>
                <View style={styles.inputView} >
                    <TextInput  
                        style={styles.inputText}
                        placeholder="Email..." 
                        value={this.state.email}
                        onChangeText={(email) => this.setState({email})}
                    />
                </View>
                <View style={styles.inputView} >
                    <TextInput  
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Password..." 
                        value={this.state.password}
                        onChangeText={(password) => this.setState({password})}
                    />
                </View>
                <TouchableOpacity style={styles.loginBtn} onPress={() => this.login()}>
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate("Sign up")}>
                    <Text style={styles.loginText}>Signup</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    letterSpacing: 3,
    fontFamily:'Iowan Old Style',
    fontSize:50,
    color:"black",
    marginBottom:40,
    fontStyle:'italic'
  },
  inputView:{
    width:"80%",
    backgroundColor:"#f8f9fa",
    borderColor: '#dee2e6',
    borderWidth: 2,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"black"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"50%",
    backgroundColor:"#0096c7",
    borderRadius: 5,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:20,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});