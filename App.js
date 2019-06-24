/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';

import { RNCamera } from 'react-native-camera';

import FaIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
//const myIcon = <Icon name="rocket" size={30} color="#900" />;


type Props = {};
export default class App extends Component<Props> {

  state = {
    image: null
  }
  takePicture = async() => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(Object.keys(data));
      this.setState({ image: data });
    }
  }

  showImage = () => (
      <Image source={{
        isStatic: true,
        uri: 'data:image/jpeg;base64,'+this.state.image.base64 }}
        style={{flex: 1, width: '100%' }} testID='image-preview' />
  );

  showCamera = () => (
    <RNCamera ref={ref => { this.camera = ref; }} style={{ flex: 1, width: '100%', }} testID='camera' />
  );

  goBackToCamera = async() => {
    this.setState({ image: null });
  }

  sendPicture = async() => {
  }


  render() {
    return (
      <View style={styles.container}>
        {this.state.image ? this.showImage() : this.showCamera()}
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#000' }}>
          { this.state.image ? 
            <View style={{flex: 0, flexDirection: 'row'}}>
              <EntypoIcon name='back' onPress={this.goBackToCamera.bind(this)} size={30} style={styles.button} testID='back-button' />
              <FaIcon name='send-o' onPress={this.sendPicture.bind(this)} size={30} style={styles.button} testID='send-button' />
            </View> :
            <FaIcon name='circle-o' onPress={this.takePicture.bind(this)} size={30} style={styles.button} testID='take-picture-button' /> 
          }
        </View>
      </View>
    );
  }
}

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
});
