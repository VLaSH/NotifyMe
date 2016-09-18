(function(){
  var electron = require('electron');
  var ipcRenderer = electron.ipcRenderer;
  var $ = require('jQuery');

	angular
		.module('app')
		.controller('DashboardsController', ['$scope', DashboardsController]);

	function DashboardsController($scope) {
    $scope.loggedIn = false;

    $scope.say = function() {
      ipcRenderer.send('return-notifications');
      ipcRenderer.on('notifications-list', function(data, b) {
        $scope.$apply(function() {
          $scope.notifications = b;
        });
      })
    }

    $scope.login = function() {
      ipcRenderer.send('login');
      ipcRenderer.on('logged-in', function(data, b) {
        console.log('logged-in');
        $scope.$apply(function() {
          $scope.loggedIn = true
        })
      })
    }
	}

})();
