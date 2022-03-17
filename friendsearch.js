import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Pressable,ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from "react-native-gesture-handler";
import {showMessage} from 'react-native-flash-message';

class FriendSearch extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      name: "",
      nameList: [],
      friendsList: []
    };
  }
    componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  searchFriends = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.name, {
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
      }else if(response.status === 400){
          showMessage({
            message: 'Please check your entry',
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
      this.setState({
        isLoading: false,
        nameList: responseJson
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }
  
  sendFriendRequest = async (id) => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends" ,  {
      method: 'post',
      headers: {
        "X-Authorization" : token,
      }
    })
    .then((response) => {
      if(response.status == 201){
        showMessage({
          message: 'Friend request sent',
          type: 'success',
          icon: 'success'
        })
      }else if(response.status === 401){
        showMessage({
          message: 'You are not authorised, please login',
          type: 'warning',
          icon: 'warning'
        })
        this.props.navigation.navigate('Login');
      }else if(response.status === 403){
        showMessage({
          message: 'User is already added as a friend',
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
    return(
    <ScrollView>
      <TextInput
        placeholder="Search Spacebook..."
        onChangeText={(name) => this.setState({name})}
        value={this.state.name}
        style={styles.searchBar}
      />
      <Pressable style={styles.button} onPress={() => this.searchFriends()}>
        <Text style={styles.text}>Search</Text>
      </Pressable>

      <View style={{paddingLeft: 10, paddingRight: 10}}>
        <FlatList
          data={this.state.nameList}
          renderItem={({item}) => (
            <View style={styles.resultsView1}>
              <Text style={styles.nameText}>{item.user_givenname} {item.user_familyname}</Text>
              <View style={styles.resultsView2}>
                <Pressable style={styles.visitButton} onPress={() => this.props.navigation.navigate('Friend Profile', item.user_id)}>
                  <Text style={styles.buttonText}>Visit Profile</Text>
                </Pressable>
                <Pressable style={styles.addButton} onPress={() => this.sendFriendRequest(item.user_id)}>
                  <Text style={styles.buttonText}>Add Friend</Text>
                </Pressable>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ScrollView>
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
  visitButton: {
    width: 110,
    backgroundColor:"#0096c7",
    borderRadius: 5,
    height:30,
    alignItems:"center",
    justifyContent:"center",
    marginRight: 10
  },
  addButton: {
    width: 110,
    backgroundColor:"#0096c7",
    borderRadius: 5,
    height:30,
    alignItems:"center",
    justifyContent:"center",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  searchBar: {
    width: '90%',
    backgroundColor:"#f8f9fa",
    borderColor: '#0096c7',
    borderWidth: 2,
    height: 50,
    justifyContent: 'center',
    margin: 20,
    padding: 20
  },
  resultsView1: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#0096c7',
    backgroundColor: 'white',
    marginBottom: 10
  },
  nameText: {
    fontWeight:'bold',
    alignSelf: 'center',
    marginLeft: 10
  },
  resultsView2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 10
  }
});
export default FriendSearch;