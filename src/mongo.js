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

  Mongo.find = function find(collectionName, query, callback) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection(collectionName);
      collection.find(query, function(err, cursor) {
        cursor.sort({ date: -1 })
        cursor.toArray(callback);
        db.close();
      })
    })
  }

  Mongo.remove = function remove(collectionName, query, callback) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection(collectionName);
      collection.remove(query, function(err, numberOfRemovedDocs) {
        callback(err, numberOfRemovedDocs)
        db.close();
      })
    })
  }

  Mongo.update = function update(collectionName, finder, query, callback) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var collection = db.collection(collectionName);
      collection.updateOne(finder, query, function(err, data) {
        callback(err, data)
        db.close();
      })
    })
  }

  return Mongo;
}
