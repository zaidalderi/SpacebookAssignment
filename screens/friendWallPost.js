import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, Alert, TextInput, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

class FriendWallPost extends Component{
  constructor(props){
    super(props);

    this.state = {
      text : "",
      friendID: this.props.route.params
    }
  }

  newPost = async () => {
    if(this.state.text.length === 0){
      console.log('Post cannot be empty')
      showMessage({
        message: 'Post cannot be empty',
        type: 'warning',
        icon: 'warning'
      })
    }else{
      let to_send = {
        text: this.state.text
      };
      const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.friendID + "/post" ,  {
          method: 'post',
          headers: {
            "X-Authorization" : token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(to_send)
        })
        .then((response) => {
          if(response.status == 201){
            showMessage({
              message: 'Post added',
              type: 'success',
              icon: 'success'
            })
            this.props.navigation.navigate('Friend Profile');
          }else if(response.status === 401){
            showMessage({
              message: 'You are not authorized, please login',
              type: 'warning',
              icon: 'warning'
            })
            this.props.navigation.navigate('Login');
          }else if(response.status === 403){
            showMessage({
              message: 'You must be friends with this user to post on their wall',
              type: 'warning',
              icon: 'warning'
            })
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

export default FriendWallPost;
