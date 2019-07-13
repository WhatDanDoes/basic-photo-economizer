/**
 * basic-photo-enconomizer: login component
 * https://github.com/WhatDanDoes/basic-photo-economizer
 *
 * 2019-7-11 component stolen from this fine fellow
 * http://kimeowgee.com/2018/10/react-native-user-login-sign-up-example-tutorial/
 */
import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View, TouchableOpacity} from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-community/async-storage';

import { showMessage } from 'react-native-flash-message';

import Api from '../lib/Api';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state= {
      authenticating: false,
      email: '',
      password: ''
    };
  }

  login = async () => {
    await this.setState({ authenticating: true });
    try {
      let result = await Api.login({ email: this.state.email, password: this.state.password });
      if (result.status === 201) {
        showMessage({
          message: result.data.message,
          description: 'Login successful',
          type: 'success',
        });
        this.props.notify(result.data.cookie);
      }
      else {
        showMessage({
          message: result.data.message,
          description: 'Login unsuccessful',
          type: 'info',
        });
      }
    } catch (error) {
      // saving error
      showMessage({
        message: error.response.data.message,
        description: 'Catastrophic failure trying to save cookie',
        type: 'danger',
      });
    }

    await this.setState({ authenticating: false });
  }

  render() {
    return(
      <View style={styles.container} testID='login-form'>
        { this.state.authenticating ?
              <View style={styles.overlay} testID='authentication-overlay'>
                <EvilIcon name='spinner-3' style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#000' }} size={30} />
              </View> :
              null 
        }
        <TextInput style={styles.inputBox}
                   onChangeText={(email) => this.setState({email})}
                   underlineColorAndroid='rgba(0,0,0,0)' 
                   placeholder="Email"
                   placeholderTextColor = "#002f6c"
                   selectionColor="#fff"
                   keyboardType="email-address"
                   onSubmitEditing={()=> this.password.focus()}
                   testID='email-input' />
        <TextInput style={styles.inputBox}
                  onChangeText={(password) => this.setState({password})} 
                  underlineColorAndroid='rgba(0,0,0,0)' 
                  placeholder="Password"
                  secureTextEntry={true}
                  placeholderTextColor = "#002f6c"
                  ref={(input) => this.password = input}
                  testID='password-input' />
        <TouchableOpacity style={styles.button} testID='login-button'> 
          <Text style={styles.buttonText} onPress={this.login}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
//    backgroundColor: '#000',
  },
  inputBox: {
    width: 300,
    backgroundColor: '#eeeeee', 
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#002f6c',
    marginVertical: 10,
    zIndex: 0
  },
  button: {
    width: 300,
    backgroundColor: '#4f83cc',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 12
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'red',
    opacity: 0.3,
  },
});

