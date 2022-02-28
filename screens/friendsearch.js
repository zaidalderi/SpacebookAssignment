import React, { Component } from "react";
import { View, Button, Text, StyleSheet, TextInput, Pressable,ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from "react-native-gesture-handler";

// const FriendSearch = ({ navigation }) => {
//   return (
//     <View>
//       <TextInput
//         placeholder="Search Spacebook"
//         style={{padding:5, borderWidth:1, margin:5, borderRadius: 30}}
//       />
//       <Button
//         title="Search"
//         style={{borderRadius: 25}}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     textAlign: "center",
//   },
// });

// export default FriendSearch;

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

  componentDidMount(){
    this.getFriendsList();
}

  searchFriends = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.name, {
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
        nameList: responseJson
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  getFriendsList = async () => {
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
      console.log("Freinds",responseJson);
      this.setState({
        isLoading: false,
        friendsList: responseJson
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
      if(response.status == 200){
        console.log("Friend Request Sent");
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
        style={{width: '90%', backgroundColor:"#f8f9fa", borderColor: '#0096c7', borderWidth: 2, height: 50, justifyContent: 'center', margin: 20, padding: 20}}
      />
      <Pressable style={styles.button} onPress={() => this.searchFriends()}>
        <Text style={styles.text}>Search</Text>
      </Pressable>

      <View style={{paddingLeft: 10, paddingRight: 10}}>
        <FlatList
          data={this.state.nameList}
          renderItem={({item}) => (
            <View style={{flex: 1, flexDirection: 'row',borderWidth: 2, borderColor: '#0096c7', backgroundColor: 'white',marginBottom: 10}}>
              <Text style={{fontWeight:'bold', alignSelf: 'center',marginLeft: 10}}>{item.user_givenname} {item.user_familyname}</Text>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', margin: 10}}>
                <Pressable style={styles.visitButton} onPress={() => this.props.navigation.navigate('Friend Profile', item.user_id)}>
                  <Text style={styles.buttonText}>Visit Profile</Text>
                </Pressable>
                <Pressable style={styles.addButton} onPress={() => this.sendFriendRequest(item.user_id)}>
                  <Text style={styles.buttonText}>Add Friend</Text>
                </Pressable>
              </View>
            </View>
          )}
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
});
export default FriendSearch;