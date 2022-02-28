import React, { Component } from "react";
import { View, Button, Text, StyleSheet, TextInput, Pressable,ScrollView,ActivityIndicator, TouchableOpacity} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from "react-native-gesture-handler";


class UpdateProfile extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      originalProfileData: [],
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      error: ""
    };
  }

  componentDidMount(){
    this.getData();
  }

  getData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@userID');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userID, {
      method: 'get',
      headers: {
        "X-Authorization" : token
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        isLoading: false,
        originalProfileData: responseJson
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  updateProfile = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@userID');
    let to_update = {};

    if(this.state.first_name != this.state.originalProfileData.first_name){
      to_update['first_name'] = this.state.first_name;
    }
    if(this.state.last_name != this.state.originalProfileData.last_name){
      to_update['last_name'] = this.state.last_name;
    }
    if(this.state.email != this.state.originalProfileData.email){
      to_update['email'] = this.state.email;
    }

    to_update['password'] = this.state.password;

    console.log(JSON.stringify(to_update));

    return fetch("http://localhost:3333/api/1.0.0/user/" + userID, {
      method: 'PATCH',
      headers: {
        "X-Authorization" : token,
        'content-type': 'application/json'
      },
      body: JSON.stringify(to_update)
    })
    .then((response) => {
      if(response.status === 200){
        this.setState = ({
          error: "Profile Updated"
        })
      }else if(response.status === 400){
        this.setState = ({
          error: "Bad Request"
        })
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }
  
  render(){
    return (
            //   <ScrollView>
            //     <TextInput
            //         placeholder="Enter your first name..."
            //         onChangeText={(first_name) => this.setState({first_name})}
            //         value={this.state.first_name}
            //         style={{padding:5, borderWidth:1, margin:5}}
            //     />
            //     <TextInput
            //         placeholder="Enter your last name..."
            //         onChangeText={(last_name) => this.setState({last_name})}
            //         value={this.state.last_name}
            //         style={{padding:5, borderWidth:1, margin:5}}
            //     />
            //     <TextInput
            //         placeholder="Enter your email..."
            //         onChangeText={(email) => this.setState({email})}
            //         value={this.state.email}
            //         style={{padding:5, borderWidth:1, margin:5}}
            //     />
            //     <Button
            //         title="Update Profile"
            //         onPress={() => this.updateProfile()}
            //     />
            // </ScrollView>
            <View style={styles.container}>              
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
                      placeholder="Enter your new email..." 
                      value={this.state.email}
                      onChangeText={(email) => this.setState({email})}
                  />
              </View>

              <View style={styles.inputView} >
                  <TextInput  
                      secureTextEntry
                      style={styles.inputText}
                      placeholder="Enter your new password..." 
                      value={this.state.password}
                      onChangeText={(password) => this.setState({password})}
                  />
              </View>
              
              <TouchableOpacity style={styles.loginBtn} onPress={() => this.updateProfile()}>
                  <Text style={styles.loginText}>Confirm Changes</Text>
              </TouchableOpacity>
            </View>
  )
  }
}

export default UpdateProfile;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 20
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