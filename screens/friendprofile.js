import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TouchableHighlight, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from "react-native-gesture-handler";
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';
import Ionicons from 'react-native-vector-icons/Ionicons'

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
            loggedInUserFriends: [],
            photo: null
        };
    }

    componentDidMount() {
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.getPosts();
        this.getFriendsList();
        this.getData();
        this.getProfileImage();
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    getData = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id, {
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
              message: "You are not authorized, please login",
              type: 'warning',
            })
            this.props.navigation.navigate('Login');
          }else {
            showMessage({
              message: "Something went wrong",
              type: 'warning',
            })
          }
        })
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

      getProfileImage = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id + "/photo", {
          method: 'GET',
          headers: {
            'X-Authorization': token
          }
        })
        .then((res) => {
          if(res.status === 200){
            return res.blob();
          }else if(res.status === 401){
            showMessage({
              message: "You are not authorized, please login",
              type: 'warning',
            })
            this.props.navigation.navigate('Login');
          }else{
            showMessage({
              message: "Something went wrong",
              type: 'warning',
            })
          }
        })
        .then((resBlob) => {
          let data = URL.createObjectURL(resBlob);
          this.setState({
            photo: data,
            isLoading: false
          });
        })
        .catch((err) => {
          console.log("error", err)
        });
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
        .then((response) => {
          if(response.status === 200){
            return response.json()
          }else if(response.status === 401){
            showMessage({
              message: "You are not authorized, please login",
              type: 'warning',
              icon: 'warning'
            })
            this.props.navigation.navigate('Login');
          }else if(response.status === 403){
            showMessage({
              message: "You must be friends with this user to view their posts",
              type: 'warning',
            })
            return response.json();
          }else{
            showMessage({
              message: "Something went wrong!",
              type: 'warning',
            }) 
          }
        })
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

      likePost = async (postID) => {
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id + "/post/" + postID + "/like", {
            method: 'POST',
            headers: {
              "X-Authorization" : token
            }
          })
          .then((response) => {
              if(response.status === 200){
              }else if(response.status === 401){
                showMessage({
                  message: "You are not authorized, please login",
                  type: 'warning',
                })
                this.props.navigation.navigate('Login');
              }else if(response.status === 403){
                showMessage({
                  message: "You cannot like your own posts",
                  type: 'warning',
                })
              }else if(response.status === 400){
                showMessage({
                  message: "You have already liked this post",
                  type: 'warning',
                  icon: 'warning'
                })
              }else{
                showMessage({
                  message: "Oops! Something went wrong!",
                  type: 'warning',
                  })
              }
          })
          .catch((error) =>{
            console.log(error)
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
        }else if(this.state.userPosts.length == 0){
          return(
            <View style={styles.container}>
                <Image
                    source={{
                      uri: this.state.photo,
                    }}
                    style={styles.imageStyle}
                />
                <View style={{flex: 1}}>
                    <Text style={styles.logo}>{this.state.profileData.first_name} {this.state.profileData.last_name}</Text>
                    <Text style={styles.logo}>{this.state.profileData.friend_count}    {this.state.userPosts.length}</Text>
                    <Text style={styles.logo}>Friends  Posts</Text>
                    <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-around'}}>
                      <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate("Friend Wall Post",this.state.id)}>
                          <Text style={styles.loginText}>Post on Wall</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate("Friends",this.state.id)}>
                          <Ionicons name='people' size={20} color='white'/>
                      </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.noPostText1}>No posts yet</Text>
                    <Text style={styles.noPostText2}>When {this.state.profileData.first_name} posts, you'll see their posts here.</Text>
                </View>
            </View>
          )
        }else{
            return(
                <View style={styles.container}>
                    <Image
                      source={{
                        uri: this.state.photo,
                      }}
                      style={styles.imageStyle}
                    />
                    <Text style={styles.logo}>{this.state.profileData.first_name} {this.state.profileData.last_name}</Text>
                    <Text style={styles.logo}>    {this.state.profileData.friend_count}             {this.state.userPosts.length}</Text>
                    <Text style={styles.logo}>Friends    Posts</Text>
                    <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-around'}}>
                      <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate("Friend Wall Post",this.state.id)}>
                          <Text style={styles.loginText}>Post on Wall</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate("Friends",this.state.id)}>
                          <Ionicons name='people' size={20} color='white'/>
                      </TouchableOpacity>
                    </View>
                    <ScrollView style={{flex: 5}}>
                        <FlatList
                            data={this.state.userPosts}
                            renderItem={({item}) => (
                                <View style={styles.profileView1}>
                                <Text style={styles.profileText}>{item.author.first_name} {item.author.last_name}</Text>
                                <Text style={styles.postText}>{item.text}</Text>
                            
                                <View style={styles.profileView2}>
                                    <Feather name="heart" size = {15} color="red"/><Text style={{paddingLeft: 5}}>{item.numLikes}</Text>
                                    <TouchableHighlight underlayColor={'transparent'} style={{marginLeft: 10}} onPress={() => this.likePost(item.post_id)}>
                                        <View>
                                            <Feather name="thumbs-up" size={15} color="#0096c7"/>
                                        </View>
                                    </TouchableHighlight>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <Text>{moment(item.timestamp).fromNow()}</Text>
                                    </View>
                                </View>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </ScrollView>
                </View>
            )
        }
      }
}

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
      marginTop: 5,
      marginBottom:5,
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
      width:"30%",
      backgroundColor:"#0096c7",
      borderRadius: 5,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:20,
      marginBottom:10
    },
    loginText:{
      color:"white",
      fontWeight: 'bold'
    },
    imageStyle: {
      width: 80,
      height: 80,
      borderWidth: 3,
      borderRadius: 100,
      borderColor: '#0996c7',
      alignContent: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 10 
    },
    noPostText1:{
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
      paddingBottom: 10,
      padding: 10
    },
    noPostText2: {
      fontWeight: 'bold',
      fontSize: 13,
      textAlign: 'center',
      paddingBottom: 20,
      padding: 10
    },
    profileView1: {
      borderWidth: 2,
      padding: 5,
      margin: 10,
      borderColor: '#0096c7',
      backgroundColor: 'white',
      borderRadius: 10
    },
    profileText: {
      fontWeight: "bold",
      fontSize: 15,
      paddingBottom: 10,
      margin: 5
    },
    postText:{
      fontSize: 13,
      padding: 10,
      paddingTop: 0
    },
    profileView2: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      margin: 5
    }
  });