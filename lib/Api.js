
import axios from 'axios';

const postImage = async function(base64Image) {
  try {
    return await axios.post(process.env.REACT_APP_DOMAIN ? `${process.env.REACT_APP_DOMAIN}/image` : 'https://localhost:3001/image', {
      base64Image: base64Image,
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

