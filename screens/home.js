import React, {Component} from 'react';
import {View, Text, FlatList, ScrollView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableHighlight } from 'react-native-gesture-handler';


class HomeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      friendsList: [],
      friendsPosts: []
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getData();
    this.getFriends();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  
  getFriends = async () => {
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
      console.log("Friends",responseJson);
      this.setState({
        isLoading: false,
        friendsList: responseJson
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }
  
  getData = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@userID');
    return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/post", {
          
          method : "get",
          headers : {
            'X-Authorization':  token
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          console.log(responseJson);
          this.setState({
            isLoading: false,
            listData: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
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

  getPostDate = (timestamp) =>{
    var postDate = new Date(timestamp).toLocaleDateString();

    return postDate;
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render() {

    if (this.state.isLoading){
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading..</Text>
        </View>
      );
    }else{
      return (
            <View style={{flex: 1}}>
              
              <View style={{flex: 1, backgroundColor: 'white'}}>
                <Text style={styles.logo}>Spacebook</Text>
              </View>
              <ScrollView style={{flex: 10, backgroundColor: 'white'}}>
                  <FlatList
                    data={this.state.listData}
                    renderItem={({item}) => (
                        <View style={{borderWidth: 2, padding: 5, margin: 10, borderColor: '#0096c7', backgroundColor: 'white', borderRadius: 10}}>
                          <Text style={{fontWeight: "bold", fontSize: 15, paddingBottom: 10}}>{item.author.first_name} {item.author.last_name}</Text>
                          <Text style={{fontSize: 13, padding: 10, paddingTop: 0}}>{item.text}</Text>


                          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', margin: 10}}>
                            <Feather name="heart" size = {15} color="red"/><Text style={{paddingLeft: 5}}>{item.numLikes}</Text>
                            <TouchableHighlight underlayColor={'transparent'} style={{marginLeft: 10}} onPress={() => this.likePost(item.post_id)}>
                              <View>
                                <Feather name="thumbs-up" size={15} color="#0096c7"/>
                              </View>
                            </TouchableHighlight>
                          </View>
                          <View style={{alignItems: 'flex-end'}}>
                            <Text>{this.getPostDate(item.timestamp)}</Text>
                          </View>

                        </View>
                    )}
                  />
              </ScrollView>
            </View>
      );
    }
    
  }
}



export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    letterSpacing: 3,
    fontFamily:'Iowan Old Style',
    fontSize:35,
    color:"black",
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    fontStyle:'italic',
    textAlign: 'center',
    marginBottom: 10
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
