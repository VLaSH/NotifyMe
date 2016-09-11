var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

module.exports = function() {
  var url = 'mongodb://localhost:27017/notify_me';
  var Mongo = {};

  Mongo.connection = function connection(callback) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      callback(db);
      db.close();
    });
  }

  Mongo.find = function find(query, callback) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      collection = db.collection('notifications');
      collection.find(query, function(err, cursor) {
        cursor.toArray(callback);
        db.close();
      })
    })
  }

  return Mongo;
}
