import React, {Component} from 'react';
import {View, Text, FlatList, ScrollView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import moment from "moment";
import {showMessage} from 'react-native-flash-message';



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
      this.getData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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
                showMessage({
                  message: 'You are not authorized, please login',
                  type: 'warning',
                  icon: 'warning'
                })
              this.props.navigation.navigate("Login");
            }else if(response.status === 403){
                showMessage({
                  message: 'You can only view the posts of yourself or your friends',
                  type: 'warning',
                  icon: 'warning'
                })
            }else{
                showMessage({
                  message: 'Something went wrong',
                  type: 'warning',
                  icon: 'wanring'
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render() {
    if(this.state.isLoading){
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
      if(this.state.listData === null){
        return(
          <View style={{flex: 1}}>
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <Text style={styles.logo}>Spacebook</Text>
            </View>
            <View style={{flex: 10, backgroundColor: 'white', justifyContent: 'center'}}>
              <Text style={styles.noPostText}>No posts</Text>
            </View>
          </View>
        ); 
      }else{
        return(
          <View style={{flex: 1}}>
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <Text style={styles.logo}>Spacebook</Text>
            </View>
            <ScrollView style={{flex: 10, backgroundColor: 'white'}}>
                <FlatList
                  data={this.state.listData}
                  renderItem={({item}) => (
                      <View style={styles.postView}>
                        <Text style={styles.authorText}>{item.author.first_name} {item.author.last_name}</Text>
                        <Text style={styles.postText}>{item.text}</Text>
                          <View style={styles.bottomView}>
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
        ); 
      }
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
  },
  postView: {
    borderWidth: 2,
    padding: 5,
    margin: 10,
    borderColor: '#0096c7',
    backgroundColor: 'white',
    borderRadius: 10
  },
  authorText: {
    fontWeight: "bold",
    fontSize: 15,
    paddingBottom: 10,
    margin: 5
  },
  postText: {
    fontSize: 13,
    padding: 10,
    paddingTop: 0
  },
  bottomView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 5
  },
  noPostText: {
    textAlign: 'center',
    paddingBottom: 20,
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold'
  }
});