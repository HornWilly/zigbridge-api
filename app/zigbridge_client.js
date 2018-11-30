var net = require('net');
var debug = require('debug')('app:server');

/**
 * Client connection on zigbridge
 */
var ZigbridgeClient = module.exports = {
    client: new net.Socket(),
    isConnected: Boolean(false),
    init: function() {
      ZigbridgeClient.client.on('data', function(data) {
        debug('Received: ' + data);
      });
      
      ZigbridgeClient.client.on('close', function() {
        debug('Connection zigbridge closed');
        ZigbridgeClient.client.destroy(); // kill client after server's response
      });
      ZigbridgeClient.client.on('error', function() {
        debug('Error on connect zigbridge, '+ZigbridgeClient.addr+ ':' + ZigbridgeClient.port);
        ZigbridgeClient.isConnected = false;
      });
    },
    connect: function() {
      ZigbridgeClient.client.connect(ZigbridgeClient.port, ZigbridgeClient.addr, function() {
        debug('Connected on zigbridge, '+ZigbridgeClient.addr+ ':' + ZigbridgeClient.port);
        ZigbridgeClient.isConnected = true;
      });
    },
    send: function(msg) {
      if (!ZigbridgeClient.isConnected) {
        ZigbridgeClient.connect();
      }
      debug('Send: ' + msg);
      ZigbridgeClient.client.write(msg);
    }
  }