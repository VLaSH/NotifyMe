var messageProducer = require('./message/message_producer');

function Message() {
};

Message.prototype.call = function call() {
  messageProducer('hello world');
};

module.exports = Message;
