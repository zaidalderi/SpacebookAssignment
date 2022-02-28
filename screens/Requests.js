import React, { Component } from "react";
import { View, Button, Text, StyleSheet, TextInput, Pressable,ScrollView,ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from "react-native-gesture-handler";


// const Friends = ({ navigation }) => {
//   return (
//     <View style={styles.center}>
//       <Text>This is the friends screen</Text>
//       <Button
//         title="Friend Requests"
//         onPress={() => navigation.navigate("Friend Requests")} // We added an onPress event which would navigate to the About screen
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

// export default Friends;

class FriendRequests extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      requestsList: []
    };
  }

  componentDidMount(){
    this.getRequests();
  }

  getRequests = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userID = await AsyncStorage.getItem('@userID');
    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
      method: 'get',
      headers: {
        "X-Authorization" : token
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("Friend Requests",responseJson);
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
    .then((response) => response.json())
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
        console.log("Friend Added");
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
        // <ScrollView>
        //   <View>
        //     <Text style={{fontWeight: 'bold', fontSize: 20, textAlign: 'center', paddingBottom: 20, paddingTop: 10}}>Friend Requests</Text>
        //     <FlatList
        //       data={this.state.requestsList}
        //       renderItem={({item}) => (
        //       <View>
        //         <Text style={{fontWeight: 'bold', fontSize: 15, padding: 10}}>{item.first_name} {item.last_name}</Text>
        //         <Button
        //           title="Confirm"
        //           onPress={() => this.acceptRequest(item.user_id)}
        //         />
        //         <Button
        //           title="Remove"
        //           onPress={() => this.rejectRequest(item.user_id)}
        //         />
        //       </View>
        //       )}
        //     />
        //   </View>
        // </ScrollView>

        <View style={{flex: 1}}>
          <ScrollView style={{flex: 1}}>
            <View>
              <Text style={{fontWeight: 'bold', fontSize: 20, textAlign: 'center', paddingBottom: 20, padding: 10}}>Friend Requests</Text>
              <View style={{paddingLeft: 10, paddingRight: 10}}>
                <FlatList
                  data={this.state.requestsList}
                  renderItem={({item}) => (
                  <View style={{flex: 1, flexDirection: 'row',borderWidth: 2, borderColor: '#0096c7', backgroundColor: 'white',marginBottom: 10}}>
                    <Text style={{fontWeight: 'bold', alignSelf: 'center', marginLeft: 10}}>{item.first_name} {item.last_name}</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', margin: 10}}>
                      <Pressable style={styles.acceptButton} onPress={() => this.acceptRequest()}>
                        <Text style={styles.buttonText}>Confirm</Text>
                      </Pressable>
                      <Pressable style={styles.rejectButton} onPress={() => this.rejectRequest()}>
                        <Text style={styles.buttonText}>Reject</Text>
                      </Pressable>
                    </View>
                  </View>
                  )}
                />
              </View>
            </View>
          </ScrollView>
        </View>


      )
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
  }
});