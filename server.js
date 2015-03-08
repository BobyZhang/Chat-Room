
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var cache = {};

var server = http.createServer(function (req, res) {
    var filePath = '';

    if (req.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + req.url;
    }

    var absPath = './' + filePath;
    serverStatic(res, cache, absPath);
}).listen(3333, function () {
    console.log('server listening on port 3333');
})

function send404(res) {
    res.writeHead(404, { 'Contend-Type': 'Text/plain' });
    res.write('Error 404: resouce not found');
    res.end();
}

function sendFile(res, filePath, fileContents) {
    res.writeHead(200, {
        "content-type": mime.lookup(path.basename(filePath))
    });
    res.end(fileContents);
}

function serverStatic(res, cache, absPath) {
    if (cache[absPath]) {
        sendFile(res, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) send404(res);
                    else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                });
            } else {
                send404(res);
            }
        });
    }
}