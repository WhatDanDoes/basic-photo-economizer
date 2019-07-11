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
  expect(Object.keys(Api).length).toEqual(1);
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
      result = await Api.postImage('somelongbase64imagestring');
    }
    catch (err) {
      throw err;
    }
    expect(result.status).toEqual(201);

    let request = moxios.requests.mostRecent();
    expect(request.url).toEqual('https://localhost:3001/image');
    expect(request.config.method).toEqual('post');
  });
});
