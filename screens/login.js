import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';



class LoginScreen extends Component{
    
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
      }
    
      componentWillUnmount() {
        this.unsubscribe();
      }
    
    
    login = async () => {

        //Validation here...
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if(reg.test(this.state.email) === false){
          showMessage({
            message: 'Email is not valid',
            type: 'warning'
          })
        }else{
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
              showMessage({
                message: "Invalid Email or Password",
                type: 'warning'
              })
            }
          })
          .then(async (responseJson) => {
              await AsyncStorage.setItem('@session_token', responseJson.token);
              await AsyncStorage.setItem('@userID',responseJson.id);
              this.props.navigation.navigate("Home");
          })
          .catch((error) => {
              console.log(error);
          })
        }
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value != null) {
            this.props.navigation.navigate('Home');
        }
      };

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.logo}>Spacebook</Text>
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
                    <Text style={styles.loginText}>SIGNUP</Text>
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