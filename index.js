// require your server and launch it here
const server = require('./api/server.js');

const port = 9000;

server.listen(port, () =>{ console.log(`Api is running on ${port}`)})
