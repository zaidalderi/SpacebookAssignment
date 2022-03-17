import React, { Component } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

class NewPost extends Component{
  constructor(props){
    super(props);

    this.state = {
      text : "",
      errorMessage: ''
    }
  }

  newPost = async () => {
    let to_send = {
      text: this.state.text
    };

    const token = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@userID');
    if(this.state.text.length === 0){
      showMessage({
        message: 'Post cannot be empty',
        type: 'warning'
      })
    }else{
        return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post" ,  {
          method: 'post',
          headers: {
            "X-Authorization" : token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(to_send)
        })
        .then((response) => {
          if(response.status === 201){
            this.props.navigation.navigate('Home');
          }else if(response.status === 401){
            console.log('You are not authorized, please login');
            showMessage({
              message: 'You are not authorized, please login',
              type: 'warning',
              icon: 'warning'
            })
            this.props.navigation.navigate('Login');
          }else{
            showMessage({
              message: 'Something went wrong!',
              type: "warning",
              icon: 'warning'
            });
          }
        })
        .catch((error) => {
          console.log(error);
        })
      }
  }

  render(){
      return (
            <View>
              <TextInput
                placeholder="What's on your mind?"
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
                multiline = 'true'
                style={styles.postInput}
              />
              <Pressable style={styles.button} onPress={() => this.newPost()}>
                <Text style={styles.text}>Post</Text>
              </Pressable>
            </View>
      );
    }
}


const styles = StyleSheet.create({
  button: {
    width:"50%",
    backgroundColor:"#0096c7",
    borderRadius: 5,
    height:30,
    alignItems:"center",
    justifyContent:"center",
    marginTop:0,
    marginBottom:10,
    marginLeft: 100
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  postInput: {
    width: '90%',
    backgroundColor:"#f8f9fa",
    borderColor: '#0096c7',
    borderWidth: 2,
    height: 100,
    margin: 20,
    padding: 20
  }
});

export default NewPost;
