var amqp = require('amqp');

module.exports = function() {
  var connection = amqp.createConnection({ host: 'localhost' });

  connection.on('error', function(e) {
    console.log("Error from amqp: ", e);
  });

  var Rabbit = {}

  Rabbit.subscribe = function subscribe(queue, callback) {
    connection.on('ready', function () {
      connection.queue(queue, function (q) {
        connection.exchange('vk', null, function(exchange) {
          console.log(queue);
          q.bind(exchange, queue);
          q.subscribe(callback);
        });
      });
    });
  }

  Rabbit.publish = function subscribe(queue, message) {
    connection.on('ready', function () {
      setTimeout(function() {
        connection.exchange('vk', null, function(e) {
          e.publish(queue, message, null, function(err) {
            console.log(err);
          });
        });
      }, 500);
    });
  }

  return Rabbit;
  // Wait for connection to become established.

}
