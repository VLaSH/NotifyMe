var Rabbit = require('../../rabbit')();
var Mongo = require('../../mongo')();
var assert = require('assert');

module.exports = function() {
  Rabbit.subscribe('vk.message', function(data) {
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

  return true;
}
