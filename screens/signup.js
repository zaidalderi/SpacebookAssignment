import React, { Component } from 'react';
import { Alert, Button, ScrollView, StyleSheet, TextInput, TouchableOpacity,View, Text} from 'react-native';

class SignupScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }

    signup = () => {
        //Validation here...
        if(this.state.password.length < 8){
            alert('Password must be minimum 8 character');
        }
        else {
            return fetch("http://localhost:3333/api/1.0.0/user", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 201){
                return response.json()
            }else if(response.status === 400){
                throw 'Failed validation';
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
               console.log("User created with ID: ", responseJson);
               this.props.navigation.navigate("Sign in");
        })
        .catch((error) => {
            console.log(error);
        })
        }
    
    }

    render(){
        return (
            
            <View style={styles.container}>
                <Text style={styles.logo}>Spacebook</Text>
                <View>
                {/* <Image style={{width: 200, height: 50}} source={require('../screens/SpacebookLogo.png')}/> */}
                </View>
                
                <View style={styles.inputView} >
                    <TextInput  
                        style={styles.inputText}
                        placeholder="Enter your frist name..." 
                        value={this.state.first_name}
                        onChangeText={(first_name) => this.setState({first_name})}
                    />
                </View>
                
                <View style={styles.inputView} >
                    <TextInput  
                        style={styles.inputText}
                        placeholder="Enter your last name..." 
                        value={this.state.last_name}
                        onChangeText={(last_name) => this.setState({last_name})}
                    />
                </View>

                <View style={styles.inputView} >
                    <TextInput  
                        style={styles.inputText}
                        placeholder="Enter your email..." 
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
                <TouchableOpacity style={styles.loginBtn} onPress={() => this.signup()}>
                    <Text style={styles.loginText}>SIGNUP</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default SignupScreen;

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