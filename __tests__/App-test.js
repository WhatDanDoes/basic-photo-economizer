/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });


// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});

it('sets state.image to null', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state('image')).toBeNull();
});
