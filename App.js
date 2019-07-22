/**
 * basic-photo-enconomizer * https://github.com/WhatDanDoes/basic-photo-economizer */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableHighlight, Image, /* AppState, */ Linking} from 'react-native';

import { RNCamera } from 'react-native-camera';

import FaIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import FlashMessage from 'react-native-flash-message';
import { showMessage } from 'react-native-flash-message';

import AsyncStorage from '@react-native-community/async-storage';

import Api from './lib/Api';
import Login from './src/Login';

const PREFIX = 'bpe://';

export default class App extends Component {

  state = {
    image: null,
    sending: false,
    token: null,
//    appState: AppState.currentState,
  }

  takePicture = this.takePicture.bind(this);
  sendPicture = this.sendPicture.bind(this);
  goBackToCamera = this.goBackToCamera.bind(this);
  setToken = this.setToken.bind(this);
  logout = this.logout.bind(this);
  openWebApp = this.openWebApp.bind(this);

  async componentDidMount() {
//    AppState.addEventListener('change', this._handleAppStateChange);
    try {
      let url = await Linking.getInitialURL();
      let token;
      if (url) {
        token = url.replace(PREFIX, '');
      }
      if (!token) {
        token = await AsyncStorage.getItem('@token');
      }
      if (token) {
        await this.setToken(token);
        await this.setState({image: null});
      }
    } catch(err) {
      showMessage({
        message: err.message,
        description: 'Error raised when accessing AsyncStorage',
        type: 'warning',
      });
    }
  }

//  componentWillUnmount() {
//    AppState.removeEventListener('change', this._handleAppStateChange);
//  }

//  _handleAppStateChange = async (nextAppState) => {
//    const token = await AsyncStorage.getItem('@token');
//    //if (this.state.appState.match(/inactive|background/) && nextAppState === 'active' && token) {
//    if (nextAppState === 'active' && token) {
//      try {
//        let result = await Api.refreshAuth(token);
//        if (result.status === 201) {
//          showMessage({
//            message: result.data.message,
//            type: 'success',
//          });
//          await this.setState({ token: result.data.token });
//        }
//        else {
//          showMessage({
//            message: result.data.message,
//            description: 'Login again',
//            type: 'warning',
//          });
//          await this.setState({ token: null });
//        }
//      } catch (error) {
//        showMessage({
//          message: error.message,
//          description: 'Catastrophic failure trying to refresh token',
//          type: 'danger',
//        });
//        await this.setState({ token: null });
//      };
//    }
//    else {
//      await this.setState({ token: null });
//    }
//    await this.setState({ appState: nextAppState });
//  };

  async takePicture() {
    if (this.camera) {
      await this.setState({ sending: true });
      const options = { quality: 0.5 };
      const data = await this.camera.takePictureAsync(options);
      await this.setState({ image: data, sending: false });
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
        description: 'Catastrophic failure trying to set token',
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

  async openWebApp() {
    await Linking.openURL(`${process.env.DOMAIN}/image`);
  }

  render() {
    return (
      <View style={styles.container}>
        { !this.state.token ?
            <Login notify={this.setToken} /> 
          : null
        }
        { !this.state.image && this.state.token ?
            <RNCamera ref={ref => { this.camera = ref; }} style={{ flex: 1, width: '100%', }} captureAudio={false} testID='camera' />
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
                <TouchableHighlight onPress={this.goBackToCamera} underlayColor="#00f"> 
                  <EntypoIcon name='back' size={30} style={styles.button} testID='back-button' />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.sendPicture} underlayColor="#00f"> 
                  <FaIcon name='send-o' size={30} style={styles.button} testID='send-button' />
                </TouchableHighlight>
              </View>
            : null
          }
          { !this.state.image && this.state.token ? 
              <View style={{flex: 1, flexDirection: 'row', backgroundColor: '#000'}}>
                <View style={[{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}]}>
                  <TouchableHighlight onPress={this.logout} underlayColor="#00f"> 
                    <AntDesignIcon name='logout' size={25} style={[styles.button]} testID='logout-button' /> 
                  </TouchableHighlight>
                </View>
                <View style={[styles.bottomAbsolute, {flex: 1, flexDirection: 'row', justifyContent: 'center'}]}>
                  <TouchableHighlight onPress={this.takePicture} underlayColor="#00f"> 
                    <EvilIcon name='camera' size={40} style={[styles.button]} testID='take-picture-button' /> 
                  </TouchableHighlight>
                </View>
                <View style={[{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}]}>
                  <TouchableHighlight onPress={this.openWebApp} underlayColor="#00f"> 
                    <MaterialCommunityIcons name='web' size={25} style={[styles.button]} testID='web-link-button' /> 
                  </TouchableHighlight>
                </View>
              </View>
            : null
          }
        </View>
        <FlashMessage position='top' testID='flash-message' />
        { this.state.sending ?
              <View style={styles.overlay} testID='sending-overlay'>
                <EvilIcon name='spinner-3' style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#000' }} size={30} />
              </View> :
              null 
        }
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
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'red',
    opacity: 0.3,
    zIndex: 1
  },
});
