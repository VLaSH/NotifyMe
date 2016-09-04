require('dotenv').config();
var http = require('request-promise');

if(!process.env.VK_TEST_TOKEN) {
  throw new Error('No token specified');
}

module.exports = function() {
  var Client = {}
  var baseUri = 'https://api.vk.com/method';

  Client.messages = function messages(count) {
    var options = {
      method: 'GET',
      uri: baseUri + '/messages.get',
      qs: {
        access_token: process.env.VK_TEST_TOKEN,
        v: '5.53',
        count: count
      },
      json: true
    };

    return http(options);
  }

  Client.getCounters = function getCounters(filter) {
    var options = {
      method: 'GET',
      uri: baseUri + '/account.getCounters',
      qs: {
        access_token: process.env.VK_TEST_TOKEN,
        v: '5.53',
        filter: filter
      },
      json: true
    };

    return http(options);
  }

  Client.getUsers = function getUsers(ids) {
    var options = {
      method: 'GET',
      uri: baseUri + '/users.get',
      qs: {
        v: '5.53',
        user_ids: ids,
        fields: ['first_name', 'last_name', 'photo_50'],
        name_case: 'Nom'
      },
      json: true
    };

    return http(options);
  }

  return Client;
}