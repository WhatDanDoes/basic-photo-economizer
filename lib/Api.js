
import axios from 'axios';

import FormData from 'form-data';

const postImage = async function(state) {
  const form = new FormData();
  form.append('docs[0]', state.image.uri);
  try {
    return await axios.post(process.env.REACT_APP_DOMAIN ? `${process.env.REACT_APP_DOMAIN}/image` : 'https://localhost:3001/image', form, {
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
    return await axios.post(process.env.REACT_APP_DOMAIN ? `${process.env.REACT_APP_DOMAIN}/login` : 'https://localhost:3001/login', credentials);
  }
  catch (err) {
    throw err;
  }
};


export default Api = { postImage, login };

