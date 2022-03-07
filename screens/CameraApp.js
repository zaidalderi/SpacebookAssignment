import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import {showMessage} from 'react-native-flash-message';

class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back
    }
  }

  async componentDidMount(){
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});
  }

  sendToServer = async (data) => {
      const userID = await AsyncStorage.getItem('@userID');;
      const token = await AsyncStorage.getItem('@session_token');

      let res = await fetch(data.base64);
      let blob = await res.blob();

      return fetch("http://localhost:3333/api/1.0.0/user/" + userID + "/photo", {
          method: "POST",
          headers: {
              "Content-Type": "image/png",
              "X-Authorization": token
          },
          body: blob
      })
      .then((response) => {
        if(response.status === 200){
          showMessage({
            message: 'Profile picture added',
            type: 'success',
            icon: 'success'
          })
          this.props.navigation.navigate('Profile');
        }else if(response.status === 401){
          showMessage({
            message: 'You are not authorized, please login',
            type: 'warning',
            icon:'warning'
          })
          this.props.navigation.navigate('Login');
        }else if(response.status === 400){
          showMessage({
            message: 'Image format not supported',
            type: 'warning',
            icon:'warning'
          })
        }else{
          showMessage({
            message: 'Something went wrong',
            type: 'warning',
            icon: 'warning'
          })
        }
      })
      .catch((err) => {
          console.log(err);
      })
  }

    takePicture = async () => {
        if(this.camera){
            const options = {
                quality: 0.5, 
                base64: true,
                onPictureSaved: (data) => this.sendToServer(data)
            };
            await this.camera.takePictureAsync(options); 
        } 
    }

  render(){
    if(this.state.hasPermission){
      return(
        <View style={styles.container}>
          <Camera style={styles.camera} type={this.state.type} ref={ref => this.camera = ref}>
            <View style={styles.cameraView}>
                <TouchableOpacity
                  style={styles.button}
                  onPress = {() => this.takePicture()}>
                  <Feather name='camera' size={20} color='white'/>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    let type = type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back;

                    this.setState({type: type});
                  }}>
                  <Feather name='refresh-cw' size={20} color='white'/>
                </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }else{
      return(
        <Text>No access to camera</Text>
      );
    }
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10
  },
  camera: {
    flex: 8,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    width:"20%",
    backgroundColor:"#0096c7",
    borderRadius: 100,
    height:50,
    width: 50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:0,
    marginBottom:10,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  cameraView: {
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 50,
    alignItems: 'flex-end',
    flexDirection: 'row'
  }
});