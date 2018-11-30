var net = require('net');
var debug = require('debug')('app:server');

/**
 * Client connection on zigbridge
 */
var ZigbridgeClient = module.exports = {
    client: new net.Socket(),
    init: function() {
      ZigbridgeClient.client.on('data', function(data) {
        debug('Received: ' + data);
      });
      
      ZigbridgeClient.client.on('close', function() {
        debug('Connection zigbridge closed');
        ZigbridgeClient.client.destroy(); // kill client after server's response
      });
    },
    connect: function(addr, port) {
      ZigbridgeClient.client.connect(port, addr, function() {
        debug('Connected on zigbridge, '+addr+ ':' + port);
        ZigbridgeClient.init();
      });
    },
    send: function(msg) {
        debug('Send: ' + msg);
      ZigbridgeClient.client.write(msg);
    }
  }