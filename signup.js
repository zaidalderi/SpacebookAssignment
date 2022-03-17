import React, { Component } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text} from 'react-native';
import { showMessage } from 'react-native-flash-message';

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
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if(this.state.password.length < 8){
            showMessage({
                message: "Password must be minimum 8 character",
                type: 'warning',
                icon: 'warning'
              })
        }else if(this.state.first_name.length === 0){
            showMessage({
                message: "First name cannot be empty",
                type: 'warning',
                icon: 'warning'
              })
        }else if(this.state.last_name.length === 0 ){
            showMessage({
                message: "Last name cannot be empty",
                type: 'warning',
                icon: 'warning'
              })
        }else if(reg.test(this.state.email) === false){
            showMessage({
                message: "Email is not valid",
                type: 'warning',
                icon: 'warning'
              })
            return false;
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
                    console.log('User created successfully')
                    showMessage({
                        message: "User created successfully",
                        type: 'success',
                        icon: 'success'
                      })
                    return response.json()
                }else if(response.status === 400){
                    showMessage({
                        message: "Please double check your entries",
                        type: 'warning',
                        icon: 'warning'
                      })
                }else{
                    showMessage({
                        message: "Something went wrong!",
                        type: 'warning',
                        icon: 'warning'
                      })
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