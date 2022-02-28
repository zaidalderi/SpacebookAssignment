import React, {Component} from 'react';
import {View, Text, FlatList, ScrollView, ActivityIndicator, Pressable, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableHighlight } from 'react-native-gesture-handler';

class ExpandPost extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            postID: this.props.route.params,
            postData: []
        };
    }

    componentDidMount(){
        this.getData();
        //this.checkPostOwner();
    }

    likePost = async (postid) => {
        const token = await AsyncStorage.getItem('@session_token');
        const userID = await AsyncStorage.getItem('@userID');
        return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post/" + postid + "/like", {
            method: 'POST',
            headers: {
                'X-Authorization' : token
            }   
        })
        .then((response) => {
            if(response.status === 200){
                console.log("Like added");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) =>{
            console.log(error);
        })
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
        .then((response) => response.json())
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
            this.setState = ({
              error: "Post Deleted"
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

      getPostDate = (timestamp) =>{
        var postDate = new Date(timestamp).toLocaleDateString();
    
        return postDate;
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
                <View style={{borderWidth: 2, padding: 5, margin: 10, borderColor: '#0096c7', backgroundColor: 'white', borderRadius: 10}}>
                    <Text style={{fontWeight: "bold", fontSize: 15, paddingBottom: 10}}>{this.state.postData.author.first_name} {this.state.postData.author.last_name}</Text>
                    <Text style={{paddingBottom: 20, marginLeft: 10}}>{this.state.postData.text}</Text>

                    

                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', margin: 10}}>
                            <Feather name="heart" size = {15} color="red"/><Text style={{paddingLeft: 5}}>{this.state.postData.numLikes}</Text>
                            <TouchableHighlight underlayColor={'transparent'} style={{marginLeft: 10}} onPress={() => this.likePost()}>
                              <View>
                                <Feather name="thumbs-up" size={15} color="#0096c7"/>
                              </View>
                            </TouchableHighlight>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <Text>{this.getPostDate(this.state.postData.timestamp)}</Text>
                    </View>

                      {/* <View style={{alignItems: 'flex-end'}}>
                            <Text>{this.state.postData.timestamp}</Text>
                      </View> */}
                </View>

                <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-around'}}>
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
    }
  });


