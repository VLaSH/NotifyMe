var messageProducer = require('./message/message_producer');
var client = require('./client')();
var messages = [];
var users = [];
var _ = require('underscore');

function Message() {
};

Message.prototype.call = function call() {
  client.getCounters('messages')
    .then(getDialogs)
    .then(getHistory)
    .then(getUsers)
    .then(serialize)
    .catch(function(err) {
      console.log(err);
      return false
    })
};

function getDialogs(data) {
  var count = data.response.messages
  if(count <= 0)
    return new Error('No notifications!');
  return client.getDialogs(count);
}

function getHistory(data) {
  console.log(data);
  var dialogs = data.response.items
  var history = [];
  for (let dialog of dialogs) {
    if(dialog.message.chat_id) {
      history.push(client.getHistory(dialog.unread, 'peer_id', 2000000000 + dialog.message.chat_id));
    } else {
      history.push(client.getHistory(dialog.unread, 'user_id', dialog.message.user_id));
    }
  }
  return Promise.all(history);
}

function getMessages(data) {
  return client.messages(data.response.messages);
}

function getUsers(data) {
  messages = _.flatten(data.map(function(message) {
    return message.response.items
  }));
  var ids = messages.map(function(message) {
    return message.user_id
  });

  return client.getUsers(ids);
}

function serialize(data) {
  users = data.response
  result =  messages.map(function(message) {
    var user = users.find(function(user) {
      return message.user_id == user.id
    });
    return {
      message_id: message.id,
      user_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      photo: user.photo_50,
      text: message.body,
      date: new Date(message.date * 1000),
      type: 'message',
      status: 'unread'
    }
  });

  publish(result);
}

function publish(data) {
  messageProducer(data);
}

module.exports = Message;
