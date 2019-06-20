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
        style={{height: 100, width:100}} testID='image-preview' />
  );

  showCamera = () => (
    <RNCamera ref={ref => { this.camera = ref; }} style={{ flex: 1, width: '100%', }} testID='camera' />
  );

  render() {
    return (
      <View style={styles.container}>
        {this.state.image ? this.showImage() : this.showCamera()}
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture} testID='take-picture-button'>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
