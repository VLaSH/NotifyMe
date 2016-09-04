var messageProducer = require('./message/message_producer');
var client = require('./client')();
var messages = [];
var users = [];

function Message() {
};

Message.prototype.call = function call(callback) {
  client.getCounters('messages')
    .then(getMessages)
    .then(getUsers)
    .then(serialize)
    .then(publish)
};

function getMessages(data) {
  return client.messages(data.response.messages);
}

function getUsers(data) {
  messages = data.response.items;
  var ids = messages.map(function(message) {
    return message.user_id
  });

  return client.getUsers(ids);
}

function serialize(data) {
  users = data.response
  return messages.map(function(message) {
    var user = users.find(function(user) {
      return message.user_id == user.id
    });
    return {
      message_id: message.id,
      user_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      photo: user.photo_50,
      text: message.body
    }
  })
}

function publish(data) {
  messageProducer(data)
}

module.exports = Message;
