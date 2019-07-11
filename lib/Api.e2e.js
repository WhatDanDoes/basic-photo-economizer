
function postImageClosure() {
  const error = true;
  let responses = [
    {status: 201, body: 'hello?'},
    {status: 201, body: 'hello, world!'},
    {status: 201, body: 'hello again, world!'},
    {status: 404, body: 'not found'},
    error, 
  ];

  return async function(base64Image) {
    let response = responses.shift();
    if (response === true) {
      throw new Error('OH NO! AN ERROR!');
    }
    return response;
  };
}

let postImage = postImageClosure();

export default Api = { postImage };


