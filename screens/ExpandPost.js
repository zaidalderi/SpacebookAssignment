import React, {Component} from 'react';
import {View, Text, ScrollView, ActivityIndicator, Pressable, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';

class ExpandPost extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            postID: this.props.route.params,
            postData: []
        };
    }

    componentDidMount() {
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.getData();
      });
    }
  
    componentWillUnmount() {
      this.unsubscribe();
    }
    
    getData = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        const userID = await AsyncStorage.getItem('@userID');
        return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + this.state.postID, {
          method: 'get',
          headers: {
            "X-Authorization" : token
          }
        })
        .then((response) => {
          if(response.status === 200){
              return response.json()
          }else if(response.status === 401){
              showMessage({
                message: 'You are not authorized, please login',
                type: 'success',
                icon: 'success'
              })
            this.props.navigation.navigate("Login");
          }else if(response.status === 403){
              showMessage({
                message: 'You can only view the posts of yourself or your friends',
                type: 'warning',
                icon: 'warning'
              })
          }else{
              showMessage({
                message: 'Something went wrong',
                type: 'warning',
                icon: 'warning'
              })
          }
      })
        .then((responseJson) => {
          console.log(responseJson);
          this.setState({
            isLoading: false,
            postData: responseJson
          })
        })
        .catch((error) => {
          console.log(error);
        })
      }

      deletePost = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        const userID = await AsyncStorage.getItem('@userID');
    
        return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + this.state.postID, {
          method: 'DELETE',
          headers: {
            "X-Authorization" : token,
          }
        })
        .then((response) => {
          if(response.status === 200){
            showMessage({
              message: "Post Deleted",
              type: 'warning',
            })
            this.props.navigation.navigate("Profile");
          }else if(response.status === 401){
            showMessage({
              message: "You are not authorized, please login",
              type: 'warning',
            })
          }else if(response.status === 403){
            showMessage({
              message: "You can only delete your own posts",
              type: 'warning',
            })
          }else{
            showMessage({
              message: "Something went wrong",
              type: 'warning',
            })
          }
        })
        .catch((error) => {
          console.log(error);
        })
      }

      render(){
        if(this.state.isLoading){
          return(
            <View>
              <ActivityIndicator
                size="large"
                color="#00ff00"
              />
            </View>
          );
        }else{
          return(
            <ScrollView>
                <View style={styles.view1}>
                    <Text style={styles.nameText}>{this.state.postData.author.first_name} {this.state.postData.author.last_name}</Text>
                    <Text style={styles.postText}>{this.state.postData.text}</Text>
                    <View style={styles.view2}>
                            <Feather name="heart" size = {15} color="red"/><Text style={{paddingLeft: 5}}>{this.state.postData.numLikes}</Text>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                              <Text>{moment(this.state.postData.timestamp).fromNow()}</Text>
                            </View>
                    </View>
                </View>
                <View style={styles.view3}>
                    <Pressable style={styles.button} onPress={() => this.props.navigation.navigate("Edit Post",this.state.postData)}>
                        <Text style={styles.buttonText}>Edit Post</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => this.deletePost()}>
                        <Text style={styles.buttonText}>Delete Post</Text>
                    </Pressable>
                </View>
            </ScrollView>
          )
        }
    }
}

export default ExpandPost;

const styles = StyleSheet.create({
    buttonText: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    button: {
      width: 110,
      backgroundColor:"#0096c7",
      borderRadius: 5,
      height:30,
      alignItems:"center",
      justifyContent:"center",
      marginTop:0,
      marginBottom:10,
    },
    view1: {
      borderWidth: 2,
      padding: 5,
      margin: 10,
      borderColor: '#0096c7',
      backgroundColor: 'white',
      borderRadius: 10
    },
    nameText: {
      fontWeight: "bold",
      fontSize: 15,
      paddingBottom: 10,
      margin: 5
    },
    postText: {
      paddingBottom: 20,
      marginLeft: 10
    },
    view2: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      margin: 5
    },
    view3: {
      flex:1,
      flexDirection: 'row',
      justifyContent: 'space-around'
    }
  });


