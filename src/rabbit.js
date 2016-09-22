var amqp = require('amqp');

class Rabbit {
  constructor() {
  }

  subscribe(queue, callback) {
    var connection = this.connection();
    connection.on('ready', function () {
      connection.queue(queue, function (q) {
        connection.exchange('vk', null, function(exchange) {
          q.bind(exchange, queue);
          q.subscribe(callback);
        });
      });
    });
  }

  publish(queue, message) {
    var connection = this.connection();
    setTimeout(function() {
      connection.exchange('vk', null, function(e) {
        e.publish(queue, message, null, function(err) {
          console.log(err);
        });
      });
    }, 3000);
  }

  connection() {
    var connection = amqp.createConnection({ host: 'localhost' });
    connection.on('error', function(e) {
      console.log("Error from amqp: ", e);
    });
    return connection;
  }
}

module.exports = Rabbit;
