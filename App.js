/**
 * basic-photo-enconomizer
 * https://github.com/WhatDanDoes/basic-photo-economizer
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableHighlight, Image} from 'react-native';

import { RNCamera } from 'react-native-camera';

import FaIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import FlashMessage from 'react-native-flash-message';
import { showMessage } from 'react-native-flash-message';

import AsyncStorage from '@react-native-community/async-storage';

import Api from './lib/Api';
import Login from './src/Login';

export default class App extends Component {

  state = {
    image: null,
    sending: false,
    token: null
  }

  takePicture = this.takePicture.bind(this);
  sendPicture = this.sendPicture.bind(this);
  goBackToCamera = this.goBackToCamera.bind(this);
  setToken = this.setToken.bind(this);
  logout = this.logout.bind(this);

  async componentDidMount() {
    try {
      let token = await AsyncStorage.getItem('@token');
      if (token) {
        await this.setState({token: token, image: null});
      }
    } catch(err) {
      showMessage({
        message: err.message,
        description: 'Error raised when accessing AsyncStorage',
        type: 'warning',
      });
    }
  }

  async takePicture() {
    if (this.camera) {
      const options = { quality: 0.5 };
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
      let result = await Api.postImage(this.state);
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
      if (err.response) {
        if (err.response.status === 401) {
          showMessage({
            message: err.message,
            description: err.response.data.message,
            type: 'warning',
          });
          // 2019-712 Can I test this with Enzyme?
          await this.setState({ token: null });
        }
        else {
          showMessage({
            message: err.message,
            description: err.response.data.message,
            type: 'warning',
          });
        }
      }
      else {
        showMessage({
          message: err.message,
          description: err.response && err.response.data ? err.response.data.message : '',
          type: 'warning',
        });
      }
    }

    await this.setState({ sending: false, image: null });
  }

  async setToken(token) {
    try {
      await AsyncStorage.setItem('@token', token);
      await this.setState({ token: token });
    } catch (error) {
      // saving error
      showMessage({
        message: error.message,
        description: 'Catastrophic failure trying to save token',
        type: 'warning',
      });
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem('@token');
      await this.setState({ token: null });
      showMessage({
        message: 'Cheerio!',
        type: 'success',
      });
    } catch (error) {
      // token removal error
      showMessage({
        message: error.message,
        description: 'Catastrophic failure trying to erase token',
        type: 'warning',
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        { !this.state.token ?
            <Login notify={this.setToken} /> 
          : null
        }
        { !this.state.image && this.state.token ?
            <RNCamera ref={ref => { this.camera = ref; }} style={{ flex: 1, width: '100%', }} testID='camera' />
          : null
        }
        { this.state.image && this.state.token ? 
            <Image source={{
              isStatic: true,
              uri: this.state.image.uri }}
              style={{flex: 1, width: '100%' }} testID='image-preview' />
          : null
        }
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#000' }}>
          { this.state.image && this.state.token ? 
              <View style={{flex: 0, flexDirection: 'row'}}>
                <EntypoIcon name='back' onPress={this.goBackToCamera} size={30} style={styles.button} testID='back-button' />
                <FaIcon name='send-o' onPress={this.sendPicture} size={30} style={styles.button} testID='send-button' />
              </View>
            : null
          }
          { !this.state.image && this.state.token ? 
              <View style={{flex: 1, flexDirection: 'row', backgroundColor: '#000'}}>
                <View style={[styles.bottomAbsolute, {flex: 1, flexDirection: 'row', justifyContent: 'center'}]}>
                  <EvilIcon name='camera' onPress={this.takePicture} size={40} style={[styles.button]} testID='take-picture-button' /> 
                </View>
                <View style={[{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}]}>
                  <TouchableHighlight onPress={this.logout}> 
                    <AntDesignIcon name='logout' size={25} style={[styles.button]} testID='logout-button' /> 
                  </TouchableHighlight>
                </View>
              </View>
            : null
          }
        </View>
        <FlashMessage position='top' testID='flash-message' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
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
//  capture: {
//    flex: 0,
//    backgroundColor: '#cdcdcd',
//    borderRadius: 90,
//    borderStyle: 'solid',
//    borderWidth: 5,
//    borderColor: '#fff',
//    padding: 15,
//    paddingHorizontal: 15,
//    alignSelf: 'center',
//    margin: 10,
//  },
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
