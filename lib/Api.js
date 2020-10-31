
import axios from 'axios';

const postImage = async function(state) {
  const form = new FormData();

  const docs = {
    name: state.image.uri.split('/').pop(),
    type: 'image/jpeg',
    uri: state.image.uri
  };
  form.append('docs', docs);
  form.append('token', state.token);

  try {
    return await axios.post(`${state.domain}/image`, form, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  catch (err) {
    throw err;
  }
};

const login = async function(credentials) {
  try {
    return await axios.post(`${state.domain}/login/api`, credentials, {
      headers: {
        'Accept': 'application/json' 
      },
    });
  }
  catch (err) {
    throw err;
  }
};


const refreshAuth = async function(token) {
  try {
    return await axios.post(`${state.domain}/login/refresh`,  { token: token}, {
      headers: {
        'Accept': 'application/json' 
      },
    });
  }
  catch (err) {
    throw err;
  }
};

export default Api = { postImage, login, refreshAuth };
