
import axios from 'axios';

import FormData from 'FormData';

const domain = process.env.DOMAIN ? `${process.env.DOMAIN}` : 'https://localhost:3001';

const postImage = async function(state) {
  const form = new FormData();

  const docs = {
    name: state.image.uri.split('/').pop(),
    type: 'image/jpeg',
    uri: state.image.uri
  };
  form.append('docs', docs);

  try {
    return await axios.post(`${domain}/image`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Cookie': state.cookie
      },
    });
  }
  catch (err) {
    throw err;
  }
};

const login = async function(credentials) {
  try {
    return await axios.post(`${domain}/login`, credentials, {
      headers: {
        'Accept': 'application/json' 
      },
    });
  }
  catch (err) {
    throw err;
  }
};

export default Api = { postImage, login };
