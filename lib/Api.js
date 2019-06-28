
import axios from 'axios';

const postImage = async function(base64Image) {

  try {
    return await axios.post('https://example.com/image', {
      base64Image: base64Image,
    });
  }
  catch (err) {
    throw err;
  }
};

export default Api = { postImage };

