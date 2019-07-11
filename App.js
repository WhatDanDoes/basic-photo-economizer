/**
 * basic-photo-enconomizer
 * https://github.com/WhatDanDoes/basic-photo-economizer
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';

import { RNCamera } from 'react-native-camera';

import FaIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

import FlashMessage from 'react-native-flash-message';
import { showMessage } from 'react-native-flash-message';

import AsyncStorage from '@react-native-community/async-storage';

import Api from './lib/Api';
import Login from './src/Login';

//const axios = require('axios');
//type Props = {};
//export default class App extends Component<Props> {
export default class App extends Component {

  state = {
    image: null,
    sending: false
  }

  takePicture = this.takePicture.bind(this);
  sendPicture = this.sendPicture.bind(this);
  goBackToCamera = this.goBackToCamera.bind(this);


  async takePicture() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      await this.setState({ image: data });
    }
  }


  async goBackToCamera() {
    await this.setState({ image: null });
  }

  async sendPicture() {
    await this.setState({ sending: true });

    try {
      let result = await Api.postImage(this.state.image.base64);
      if (result.status === 201) {
        showMessage({
          message: 'Image sent',
          description: 'The image was successfully sent and received',
          type: 'success',
        });
      }
      else {
        showMessage({
          message: 'Image could not be sent',
          description: 'The image was not received',
          type: 'warning',
        });
      }
    }
    catch(err) {
      showMessage({
        message: err.message,
        description: 'Serious unforeseen error',
        type: 'warning',
      });

    }

    await this.setState({ sending: false, image: null });
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@cookie')
      if(value !== null) {
        // value previously stored
      }
    } catch(e) {
      // error reading value
    }
  }

  render() {
    return (
        <Login />

    );
  }
}

//      <View style={styles.container}>
//        { this.state.image ? 
//              <Image source={{
//                isStatic: true,
//                uri: 'data:image/jpeg;base64,'+this.state.image.base64 }}
//                style={{flex: 1, width: '100%' }} testID='image-preview' /> :
//              <RNCamera ref={ref => { this.camera = ref; }} style={{ flex: 1, width: '100%', }} testID='camera' />
//        }
//        { this.state.sending ?
//              <View style={styles.overlay} testID='sending-message-overlay'>
//                <Text>HELLLOOOOO</Text>
//                <EvilIcon name='spinner-3' style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#000' }} size={30} />
//              </View> :
//              null 
//        }
//        <FlashMessage position='center' testID='flash-message' />
//        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#000' }}>
//          { this.state.image ? 
//                <View style={{flex: 0, flexDirection: 'row'}}>
//                  <EntypoIcon name='back' onPress={this.goBackToCamera} size={30} style={styles.button} testID='back-button' />
//                  <FaIcon name='send-o' onPress={this.sendPicture} size={30} style={styles.button} testID='send-button' />
//                </View> :
//                <FaIcon name='circle-o' onPress={this.takePicture} size={30} style={styles.button} testID='take-picture-button' /> 
//          }
//        </View>
//      </View>

const styles = StyleSheet.create({
  button: {
    color: '#fff',
    margin: 10
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  capture: {
    flex: 0,
    backgroundColor: '#cdcdcd',
    borderRadius: 90,
    borderStyle: 'solid',
    borderWidth: 5,
    borderColor: '#fff',
    padding: 15,
    paddingHorizontal: 15,
    alignSelf: 'center',
    margin: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'red',
    opacity: 0.3
  },
});
