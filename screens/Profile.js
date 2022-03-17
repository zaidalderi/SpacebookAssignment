import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TouchableHighlight, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from "react-native-gesture-handler";
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import { showMessage } from "react-native-flash-message";

class Profile extends Component {

  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      userPosts: [],
      photo: null
    };
  }

  componentDidMount(){
    this.unsubsribe = this.props.navigation.addListener('focus', () => {
      this.getPosts();
      this.getData();
      this.getProfileImage();
    })
  }
  componentWillUnmount() {
    this.unsubscribe();
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
          message: "Something went wrong!",
          type: 'warning',
        })
      }
    })
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        listData: responseJson
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  getProfileImage = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@userID');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/photo", {
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
    return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post", {
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
          message: "Something went wrong!",
          type: 'warning',
        })
      }
    })
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        userPosts: responseJson
      })
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
      if(this.state.userPosts.length === 0){
        return(
          <View style={styles.container}>
            <Image
              source={{
                uri: this.state.photo,
              }}
              style={styles.imageStyle}
            />
            <Text style={styles.logo}>{this.state.listData.first_name} {this.state.listData.last_name}</Text>
            <Text style={styles.logo}>    {this.state.listData.friend_count}             {this.state.userPosts.length}</Text>
            <Text style={styles.logo}>Friends    Posts</Text>
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 3, borderBottomColor: '#0096c7'}}>
              <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate("Update Profile")}>
                  <Text style={styles.loginText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate("Camera")}>
                  <Text style={styles.loginText}>+ Profile Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={{flex: 5, justifyContent: 'center', alignContent: 'center'}}>
              <Text style={styles.noPostText}>No Posts Yet</Text>
            </View>
          </View>
        )
      }
      return(
        <View style={styles.container}>

          <Image
            source={{
              uri: this.state.photo,
            }}
            style={styles.imageStyle}
          />
          <Text style={styles.logo}>{this.state.listData.first_name} {this.state.listData.last_name}</Text>
          <Text style={styles.logo}>    {this.state.listData.friend_count}             {this.state.userPosts.length}</Text>
          <Text style={styles.logo}>Friends    Posts</Text>
          <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 3, borderBottomColor: '#0096c7'}}>
            <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate("Update Profile")}>
                <Text style={styles.loginText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} onPress={() => this.props.navigation.navigate("Camera")}>
                <Text style={styles.loginText}>+ Profile Photo</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={{flex: 5}}>
                <FlatList
                  data={this.state.userPosts}
                  renderItem={({item}) => (
                      <View style={styles.view1}>
                        <View style={styles.view2}>
                            <Text style={styles.nameText}>{item.author.first_name} {item.author.last_name}</Text>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                              <TouchableHighlight underlayColor={'transparent'} onPress={() => this.props.navigation.navigate("Expand Post",item.post_id)}>
                                <View style={{alignItems: 'flex-end' ,paddingLeft: 5}}>
                                  <Feather name="arrow-right" size={15} color="#0096c7"/>
                                </View>
                              </TouchableHighlight>
                            </View>
                        </View>
                        <Text style={styles.postText}>{item.text}</Text>
                        <View style={styles.view3}>
                            <Feather name="heart" size = {15} color="red"/><Text style={{paddingLeft: 5}}>{item.numLikes}</Text>
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

export default Profile;

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
  view1: {
    borderWidth: 2,
    padding: 5,
    margin: 10,
    borderColor: '#0096c7',
    backgroundColor: 'white',
    borderRadius: 10
  },
  view2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 5
  },
  view3: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 5
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 15,
    paddingBottom: 10
  },
  postText: {
    fontSize: 13,
    padding: 10,
    paddingTop: 0
  },
  noPostText: {
    textAlign: 'center',
    paddingBottom: 20,
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold'
  }
});