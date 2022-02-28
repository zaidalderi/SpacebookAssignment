import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, Alert, TextInput, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

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
        this.setState = ({
          error: "Post Updated"
        })
        this.props.navigation.navigate("Profile");
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
            <View>
              <TextInput
                placeholder="What's on your mind?"
                onChangeText={(newText) => this.setState({newText})}
                defaultValue={this.state.originalPost}
                value={this.state.newText}
                multiline = 'true'
                style={{width: '90%', backgroundColor:"#f8f9fa", borderColor: '#0096c7', borderWidth: 2, height: 100, margin: 20, padding: 20}}
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
});

export default EditPost;
