
import axios from 'axios';

const postImage = async function(base64Image) {
  return {status: 201, body: 'hello, world!'};
//  try {
//    return await axios.post('https://example.com/image', {
//      base64Image: base64Image,
//    });
//  }
//  catch (err) {
//    throw err;
//  }
};

export default Api = { postImage };

//function postImageClosure() {
//  const error = true;
//  let responses = [
//    {status: 201, body: 'hello, world!'},
//    {status: 404, body: 'not found'},
//    error, 
//  ];
//
//  return
//}


