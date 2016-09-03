var friendsProducer = require('./friends/friends_producer');

function Friends() {
};

Friends.prototype.call = function call() {
  friendsProducer('Here');
};

module.exports = Friends;
