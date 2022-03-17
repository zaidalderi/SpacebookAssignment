import React, {Component} from "react";
import {View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from "react-native-gesture-handler";
import {showMessage} from 'react-native-flash-message';

class FriendRequests extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      requestsList: [],
      message: ''
    };
  }
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getRequests();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getRequests = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
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
            type: 'warning',
            icon: 'warning'
          })
        this.props.navigation.navigate("Login");
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
        requestsList: responseJson
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  acceptRequest = async (id) => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + id, {
      method: 'POST',
      headers: {
        "X-Authorization" : token
      }
    })
    .then((response) => {
      if(response.status === 200){
        showMessage({
          message: 'Friend added',
          type: 'success',
          icon: 'success'
        })  
        return response.json()
      }else if(response.status === 401){
          showMessage({
            message: 'You are not authorized, please login',
            type: 'warning',
            icon: 'warning'
          })
        this.props.navigation.navigate("Login");
      }else{
          showMessage({
            message: 'Something went wrong',
            type: 'warning',
            icon: 'warning'
          })
      }
    })
    .then((responseJson) => {
      console.log("Friend Added",responseJson);
      this.setState({
        isLoading: false
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  rejectRequest = async (id) => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + id, {
      method: 'DELETE',
      headers: {
        "X-Authorization" : token
      }
    })
    .then((response) => {
      if(response.status === 200){
        showMessage({
          message: 'Friend request removed',
          type: 'success',
          icon: 'success'
        })
        return response.json()
      }else if(response.status === 401){
          showMessage({
            message: 'You are not authorized, please login',
            type: 'warning',
            icon: 'warning'
          })
        this.props.navigation.navigate("Login");
      }else{
          showMessage({
            message: 'Something went wrong',
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
      if(this.state.requestsList.length === 0){
        return(
          <View style={{flex: 1}}>
            <View style={{flex: 1}}>
                <Text style={styles.title}>Friend Requests</Text>
            </View>
            <View style={{flex: 2}}>
              <Text style={styles.noRequestText}>You have no pending friend requests</Text> 
            </View>
          </View>
        )
      }else{
        return(
          <View style={{flex: 1}}>
            <ScrollView style={{flex: 1}}>
              <View>
                <Text style={styles.title}>Friend Requests</Text>
                <View style={{paddingLeft: 10, paddingRight: 10}}>
                  <FlatList
                    data={this.state.requestsList}
                    renderItem={({item}) => (
                    <View style={styles.requestView1}>
                      <Text style={styles.friendNameText}>{item.first_name} {item.last_name}</Text>
                      <View style={styles.requestView2}>
                        <Pressable style={styles.acceptButton} onPress={() => this.acceptRequest(item.user_id)}>
                          <Text style={styles.buttonText}>Confirm</Text>
                        </Pressable>
                        <Pressable style={styles.rejectButton} onPress={() => this.rejectRequest(item.user_id)}>
                          <Text style={styles.buttonText}>Reject</Text>
                        </Pressable>
                      </View>
                    </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        )
      }
    }
  }
}

export default FriendRequests;

const styles = StyleSheet.create({
  acceptButton: {
    width: 110,
    backgroundColor:"#0096c7",
    borderRadius: 5,
    height:30,
    alignItems:"center",
    justifyContent:"center",
    marginRight: 10
  },
  rejectButton: {
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

  requestsButton: {
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
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    paddingBottom: 20,
    padding: 10
  },
  noRequestText: {
    textAlign: 'center',
    paddingBottom: 20,
    padding: 10,
    fontSize: 15,
    fontWeight: 'bold'
  },
  requestView1: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#0096c7',
    backgroundColor: 'white',
    marginBottom: 10
  },
  friendNameText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: 10
  },
  requestView2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 10
  }
});