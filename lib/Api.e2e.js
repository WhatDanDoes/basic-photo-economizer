
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


function login(credentials) {
  if (credentials.email === 'someguy@example.com' && credentials.password === 'secret') {
    return { status: 201, data: { message: 'Hello, someguy@example.com!', token: 'somejwttoken' } };
  }
  return { status: 401, data: { message: 'Invalid email or password' } };
};


export default Api = { postImage, login };


