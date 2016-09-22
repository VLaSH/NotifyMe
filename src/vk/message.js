var Client = require('./client'),
    client;
var messages = [];
var users = [];
var _ = require('underscore');
var Rabbit = require('../rabbit'),
    rabbit = new Rabbit();
var Mongo = require('../mongo')();
var assert = require('assert');

function Message() {
  rabbit.subscribe('vk.message', function(data) {
    Mongo.connection(function(db) {
      var collection = db.collection('notifications');

      collection.createIndex({ message_id: 1 }, { unique: true });
      collection.insertMany(data.message, { ordered: false }, function(err, result) {
        if(err) {
          console.log(err.message);
          return false;
        }
        console.log('inserted', err);
        assert.equal(err, null);
        assert.equal(data.message.length, result.result.n);
        assert.equal(data.message.length, result.ops.length);
        console.log("Inserted " + data.message.length + " notifications into the collection");
        db.close();
      });
    });
  });
};

Message.prototype.call = function call(token) {
  client = new Client(token);
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

Message.prototype.publish = publish;

function getDialogs(data) {
  console.log(data);
  var count = data.response.messages
  if(count <= 0)
    return new Error('No notifications!');
  return client.getDialogs(count);
}

function getHistory(data) {
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
  var result =  messages.map(function(message) {
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
      status: 'unread',
      provider: 'vk'
    }
  });

  publish(result);
}

function publish(message) {
  rabbit.publish('vk.message', { message: message });
};

module.exports = Message;
