import React, { Component } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';

class EditPost extends Component{
  constructor(props){
    super(props);

    this.state = {
      newText : undefined,
      originalPost: this.props.route.params.text,
      postID : this.props.route.params.post_id
    }
  }

  editPost = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@userID');
    let to_update = {};

    if(this.state.newText != this.state.originalPost){
      to_update['text'] = this.state.newText;
    }

    console.log(JSON.stringify(to_update));

    return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + this.state.postID, {
      method: 'PATCH',
      headers: {
        "X-Authorization" : token,
        'content-type': 'application/json'
      },
      body: JSON.stringify(to_update)
    })
    .then((response) => {
      if(response.status === 200){
        showMessage({
          message:'Post edited successfully',
          type: 'success',
          icon: 'success'
        })
        this.props.navigation.navigate("Profile");
      }else if(response.status === 400){
        showMessage({
          message:'Please double check your entry',
          type: 'warning',
          icon: 'warning'
        })
      }else if(response.status === 401){
        showMessage({
          message: 'You are not authorised, please login',
          type: 'warning',
          icon: 'warning'
        })
      }else if(response.status === 403){
        showMessage({
          message: 'You can only edit your own posts',
          type: 'warning',
          icon: 'warning'
        })
      }else{
        showMessage({
          message: 'Something went wrong!',
          type: 'warning',
          icon: 'warning'
        })
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render(){
      return (
            <View>
              <TextInput
                placeholder="What's on your mind?"
                onChangeText={(newText) => this.setState({newText})}
                defaultValue={this.state.originalPost}
                value={this.state.newText}
                multiline = 'true'
                style={styles.postInput}
              />
              <Pressable style={styles.button} onPress={() => this.editPost()}>
                <Text style={styles.text}>Update</Text>
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

export default EditPost;
