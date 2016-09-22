require('dotenv').config();

var http = require('request-promise');

if(!process.env.VK_TEST_TOKEN) {
  throw new Error('No token specified');
}

class Client {
  constructor(token) {
    this.baseUri = 'https://api.vk.com/method';
    this.token = token;
  }

  messages(count) {
    var options = {
      method: 'GET',
      uri: this.baseUri + '/messages.get',
      qs: {
        access_token: this.token,
        v: '5.53',
        count: count
      },
      json: true
    };

    return http(options);
  }

  getCounters(filter) {
    var options = {
      method: 'GET',
      uri: this.baseUri + '/account.getCounters',
      qs: {
        access_token: this.token,
        v: '5.53',
        filter: filter
      },
      json: true
    };

    return http(options);
  }

  getUsers(ids) {
    var options = {
      method: 'GET',
      uri: this.baseUri + '/users.get',
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

  getDialogs(count) {
    var options = {
      method: 'GET',
      uri: this.baseUri + '/messages.getDialogs',
      qs: {
        v: '5.53',
        count: count,
        unread: true,
        access_token: this.token
      },
      json: true
    };

    return http(options);
  }

  getHistory(count, type, id) {
    var options = {
      method: 'GET',
      uri: this.baseUri + '/messages.getHistory',
      qs: {
        v: '5.53',
        count: count,
        access_token: this.token
      },
      json: true
    };
    options.qs[type] = id

    return http(options);
  }
}

module.exports = Client;
