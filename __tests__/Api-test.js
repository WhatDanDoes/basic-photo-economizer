/**
 * @format
 */

//import 'react-native';
//import React from 'react';
import Api from '../lib/Api';

import moxios from 'moxios';

//import Enzyme from 'enzyme';
//import Adapter from 'enzyme-adapter-react-16';
//Enzyme.configure({ adapter: new Adapter() });


// Note: test renderer must be required after react-native.
//import renderer from 'react-test-renderer';
//

it('doesn\'t bomb', () => {
  expect(Api).toBeDefined();
  expect(Object.keys(Api).length).toEqual(2);
});
 
describe('postImage', () => {
  beforeEach(() => {
    moxios.install()

    moxios.stubRequest(/.*/, {
      status: 201,
      responseText: 'hello'
    });
  });

  afterEach(() => {
    moxios.uninstall()
  });

 
  it('sends a properly formatted API call', async () => {
    let result;
    try {
      result = await Api.postImage({ image: { uri: 'file:///path/to/image.jpg' }, cookie: 'cookie=delicious' });
    }
    catch (err) {
      throw err;
    }
    expect(result.status).toEqual(201);

    let request = moxios.requests.mostRecent();
    expect(request.url).toEqual('https://localhost:3001/image');
    expect(request.config.method).toEqual('post');
    expect(request.headers['Accept']).toMatch(/json/);
    expect(request.headers['Cookie']).toBeDefined();
    expect(request.headers['Content-Type']).toEqual('multipart/form-data');
  });
});


describe('login', () => {
  beforeEach(() => {
    moxios.install()

    moxios.stubRequest(/.*/, {
      status: 201,
      responseText: 'hello'
    });
  });

  afterEach(() => {
    moxios.uninstall()
  });

  it('sends a properly formatted API call', async () => {
    let result;
    try {
      result = await Api.login({ email: 'someguy@example.com', password: 'secret' });
    }
    catch (err) {
      throw err;
    }
    expect(result.status).toEqual(201);

    let request = moxios.requests.mostRecent();
    expect(request.url).toEqual('https://localhost:3001/login');
    expect(request.config.method).toEqual('post');
    let credentials = JSON.parse(request.config.data);
    expect(credentials.email).toEqual('someguy@example.com');
    expect(credentials.password).toEqual('secret');
    expect(request.config.headers['Accept']).toMatch(/json/);
    expect(request.config.headers['Content-Type']).toMatch(/json/);
  });
});


