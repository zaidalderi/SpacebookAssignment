import React, { Component } from "react";
import { View, Button, Text, StyleSheet, TextInput, Pressable,ScrollView,ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from "react-native-gesture-handler";

class Friends extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: []
    };
  }

  componentDidMount(){
    this.getData();
  }

  getData = async () => {
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
        listData: responseJson
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
      return(
        <View style={{flex: 1}}>
          <ScrollView style={{flex: 1}}>
            <View>
              <Text style={{fontWeight: 'bold', fontSize: 20, textAlign: 'center', paddingBottom: 20, padding: 10}}>My Friends</Text>
              <View style={{paddingLeft: 10, paddingRight: 10}}>
                <FlatList
                  data={this.state.listData}
                  renderItem={({item}) => (
                  <View style={{flex: 1, flexDirection: 'row',borderWidth: 2, borderColor: '#0096c7', backgroundColor: 'white',marginBottom: 10}}>
                    <Text style={{fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{item.user_givenname} {item.user_familyname}</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', margin: 10}}>
                      <Pressable style={styles.profileButton} onPress={() => this.props.navigation.navigate("Friend Profile",item.user_id)}>
                        <Text style={styles.buttonText}>View Profile</Text>
                      </Pressable>
                    </View>
                  </View>
                  )}
                />
              </View>
            </View>
          </ScrollView>

          <View style={{flex: 1}}>
              <Pressable style={styles.requestsButton} onPress={() => this.props.navigation.navigate("Friend Requests")}>
                <Text style={styles.buttonText}>Friend Requests</Text>
              </Pressable>
          </View>
        </View>
      )
    }
  }
}

export default Friends;

const styles = StyleSheet.create({
  profileButton: {
    width: 110,
    backgroundColor:"#0096c7",
    borderRadius: 5,
    height:30,
    alignItems:"center",
    justifyContent:"center",
    margin: 0
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
  }
});