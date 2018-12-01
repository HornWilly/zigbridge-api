"use strict";

var debug = require('debug')('app:server');


/**
 * WebSocket Server
 */
var webSocketService = module.exports = {
    clients: [],
    init: function() {
        // Port where we'll run the websocket server
        var webSocketsServerPort = 1337;

        // websocket and http servers
        var webSocketServer = require('websocket').server;
        var http = require('http');

        /**
         * HTTP server
         */
        var server = http.createServer(function(request, response) {
            // Not important for us. We're writing WebSocket server,
            // not HTTP server
        });
        
        server.listen(webSocketsServerPort, function() {
            debug((new Date()) + " WebSocket Server is listening on port "
                + webSocketsServerPort);
        });

        /**
         * WebSocket server
         */
        var wsServer = new webSocketServer({
            // WebSocket server is tied to a HTTP server. WebSocket
            // request is just an enhanced HTTP request. For more info
            // http://tools.ietf.org/html/rfc6455#page-6
            httpServer: server
        });
        
        // This callback function is called every time someone
        // tries to connect to the WebSocket server
        wsServer.on('request', function(request) {
            debug((new Date()) + ' Connection from origin '
                + request.origin + '.');
        
            // accept connection - you should check 'request.origin' to
            // make sure that client is connecting from your website
            // (http://en.wikipedia.org/wiki/Same_origin_policy)
            var connection = request.accept(null, request.origin);
        
            debug((new Date()) + ' Connection accepted.');
        
            // we need to know client index to remove them on 'close' event
            var index = webSocketService.clients.push(connection) - 1;

            // user disconnected
            connection.on('close', function(connection) {
                debug((new Date()) + " Peer "
                    + connection.remoteAddress + " disconnected.");
                // remove user from the list of connected clients
                webSocketService.clients.splice(index, 1);
            });
        });
    },
    /**
     * Helper function for escaping input strings
     */
    htmlEntities: function (str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },
    broadcastMessage: function(message) {
        // broadcast message to all connected clients
        var json = JSON.stringify(message);
        for (var i=0; i < webSocketService.clients.length; i++) {
            webSocketService.clients[i].sendUTF(json);
        }
    }
}