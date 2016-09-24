(function(){
  var electron = require('electron');
  var ipcRenderer = electron.ipcRenderer;
  var $ = require('jQuery');
  var _ = require('underscore');

	angular
		.module('app')
		.controller('NotificationsController', ['$scope', '$state', NotificationsController]);

	function NotificationsController($scope, $state) {
    $scope.notifications = [];
    $scope.provider = $state.params.provider;

    $scope.fetchNotifications = function(provider) {
      ipcRenderer.send(provider + '/notifications/fetch_local');
      ipcRenderer.once(provider + '/notifications/fetch_local/response', function(e, data) {
        $scope.notifications = data;
        $scope.$apply();
      })
    }

    $scope.makeRead = function(id) {
      ipcRenderer.send($scope.provider + '/notifications/update', { id: id });
      ipcRenderer.once($scope.provider + '/notifications/update/response', function(e, data) {
        console.log('lol');
        $scope.notifications = _.reject($scope.notifications, function(notification) {
          return notification._id == id;
        })
        $scope.$apply();
      })
    }

    $scope.fetchNotifications($scope.provider)
	}

})();
