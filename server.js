const http = require('http');
const nStatic = require('node-static');
const fileServer = new nStatic.Server('./');
const server = http.createServer(function (req, res) {
    fileServer.serve(req, res);
});

server.listen(process.env.PORT || 3000);