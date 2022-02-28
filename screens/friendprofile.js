import React, { Component } from "react";
import { View, Button, Text, StyleSheet, TextInput, Pressable,ScrollView,ActivityIndicator, TouchableOpacity, TouchableHighlight } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from "react-native-gesture-handler";
import Feather from 'react-native-vector-icons/Feather';

class FriendProfile extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            id: this.props.route.params,
            profileData: [],
            myfriendsList: [],
            friendsFriendList: [],
            userPosts: [],
            loggedInUserFriends: []
        };
    }

    componentDidMount(){
        this.getPosts();
        this.getFriendsList();
        this.getLoggedInUserFriends();
        this.getData();
    }

    getData = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id, {
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
            profileData: responseJson
          })
        })
        .catch((error) => {
          console.log(error);
        })
      }

      getFriendsList = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id + "/friends", {
          method: 'get',
          headers: {
            "X-Authorization" : token
          }
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("Friends",responseJson);
          this.setState({
            isLoading: false,
            firendsFriendList: responseJson
          })
        })
        .catch((error) => {
          console.log(error);
        })
      }

      getPosts = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        const userID = await AsyncStorage.getItem('@userID');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id + "/post", {
          method: 'get',
          headers: {
            "X-Authorization" : token
          }
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("Posts",responseJson);
          this.setState({
            isLoading: false,
            userPosts: responseJson
          })
        })
        .catch((error) => {
          console.log(error);
        })
      }

      getLoggedInUserFriends = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        const userID = await AsyncStorage.getItem('@userID');
        return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/friends", {
            method: 'get',
            headers: {
              "X-Authorization" : token
            }
          })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log("Logged in User Friends",responseJson);
            this.setState({
              isLoading: false,
              loggedInUserFriends: responseJson
            })
          })
          .catch((error) => {
            console.log(error);
          })
      }

      likePost = async (postID) => {
        const token = await AsyncStorage.getItem('@session_token');
        const userID = await AsyncStorage.getItem('@userID');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id + "/post/" + postID + "/like", {
            method: 'POST',
            headers: {
              "X-Authorization" : token
            }
          })
          .then((response) => {
              if(response.status === 200){
                  throw "Post Liked"
              }else if(response.status === 400){
                  console.log("You have already liked this post")
              }
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
        }else if(this.state.userPosts.length == 0){
          return(
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <Text style={styles.logo}>{this.state.profileData.first_name} {this.state.profileData.last_name}</Text>
                    {/* <Text style={styles.logo}>{this.state.profileData.email}</Text> */}
                    <Text style={styles.logo}>{this.state.profileData.friend_count}    {this.state.userPosts.length}</Text>
                    <Text style={styles.logo}>Friends  Posts</Text>
                    <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate("Friend Wall Post",this.state.id)}>
                        <Text style={styles.loginText}>Post on Wall</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, }}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, textAlign: 'center', paddingBottom: 10, padding: 10}}>No posts yet</Text>
                    <Text style={{fontWeight: 'bold', fontSize: 13, textAlign: 'center', paddingBottom: 20, padding: 10}}>When {this.state.profileData.first_name} posts, you'll see their posts here.</Text>
                </View>
          </View>
          )
        }else{
            return(
                <View style={styles.container}>
                    <Text style={styles.logo}>{this.state.profileData.first_name} {this.state.profileData.last_name}</Text>
                    {/* <Text style={styles.logo}>{this.state.profileData.email}</Text> */}
                    <Text style={styles.logo}>{this.state.profileData.friend_count}    {this.state.userPosts.length}</Text>
                    <Text style={styles.logo}>Friends  Posts</Text>
                    <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate("Friend Wall Post",this.state.id)}>
                        <Text style={styles.loginText}>Post on Wall</Text>
                    </TouchableOpacity>
                    <ScrollView style={{flex: 1}}>
                        <FlatList
                            data={this.state.userPosts}
                            renderItem={({item}) => (
                                <View style={{borderWidth: 2, padding: 5, margin: 10, borderColor: '#0096c7', backgroundColor: 'white', borderRadius: 10}}>
                                <Text style={{fontWeight: "bold", fontSize: 15, paddingBottom: 10}}>{item.author.first_name} {item.author.last_name}</Text>
                                <Text style={{fontSize: 13, padding: 10, paddingTop: 0}}>{item.text}</Text>
                                

                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', margin: 10}}>
                                    <Feather name="heart" size = {15} color="red"/><Text style={{paddingLeft: 5}}>{item.numLikes}</Text>
                                    <TouchableHighlight underlayColor={'transparent'} style={{marginLeft: 10}} onPress={() => this.likePost()}>
                                        <View>
                                            <Feather name="thumbs-up" size={15} color="#0096c7"/>
                                        </View>
                                    </TouchableHighlight>
                                </View>

                                <View style={{alignItems: 'flex-end'}}>
                                    <Text>{this.getPostDate(item.timestamp)}</Text>
                                </View>

                                {/* <Text>{this.state.friendsList[1].user_id}</Text> */}
                                </View>
                            )}
                        />
                    </ScrollView>
                </View>
            )
        }
      }
}

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     textAlign: "center",
//   },
// });

export default FriendProfile;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'flex-start',
    },
    logo:{
      fontWeight: 'bold',
      fontSize:15,
      textAlign: 'center',
      color:"black",
      marginTop: 10,
      marginBottom:10,
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
      marginBottom:10,
      marginLeft: 100
    },
    loginText:{
      color:"white"
    }
  });