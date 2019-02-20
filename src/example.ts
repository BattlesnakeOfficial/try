export default `function start() {
  return { color: "#3d00a6" }
}

function move(state) {
  console.log(state);
  return { move: 'right' }
}

// Uncomment this code to run your app in an express server!
// const http = require('http');
// const port = 3000;
// const server = http.createServer(function(req, res) {
//   switch (req.url) {
//     case '/move':
//       res.statusCode = 200;
//       res.end(JSON.stringify(move()));
//       break;
//     default:
//       res.statusCode = 404;
//       res.end('not found');
//   }
// });
// server.listen(port, function(err) {
//   if (err) {
//     throw err;
//   }
//   console.log('server is listening on', port);
// });`
