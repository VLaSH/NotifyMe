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
      ipcRenderer.send('vk/notifications/fetch_local');
      ipcRenderer.once('vk/notifications/fetch_local/response', function(e, data) {
        console.log(data);
        $scope.$apply(function() {
          $scope.notifications = data;
        });
      })
    }

    $scope.login = function() {
      ipcRenderer.send('vk/auth/check');
      ipcRenderer.once('vk/auth/check/response', function(e, data) {
        console.log(data);
        if(data.length == 0) {
          ipcRenderer.send('vk/auth/login')
          ipcRenderer.once('vk/auth/login/response', function(e, data) {
            $scope.$apply(function() {
              $scope.loggedIn = true
            })
          })
        } else {
          console.log('lol');
          $scope.$apply(function() {
            $scope.loggedIn = true
          })
        }
      })
    }
	}

})();
