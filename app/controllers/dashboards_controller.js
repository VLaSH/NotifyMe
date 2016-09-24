(function(){
  var electron = require('electron');
  var ipcRenderer = electron.ipcRenderer;
  var $ = require('jQuery');

	angular
		.module('app')
		.controller('DashboardsController', ['$scope', 'ngDialog', '$state', DashboardsController]);

	function DashboardsController($scope, ngDialog, $state) {
    $scope.loggedIn = false;
    $scope.providers = [];
    $scope.notificationsCount = {};

    $scope.dialog = function() {
      var dial = ngDialog.open({
        template: '../views/dialog.html',
        className: 'ngdialog-theme-default',
        controller: 'DialogsController',
        data: {
          providers: $scope.providers
        }
      });
      dial.closePromise.then(function(data) {
        $scope.login(data.value)
      })
    }

    $scope.say = function() {
      ipcRenderer.send('vk/notifications/fetch_local');
      ipcRenderer.once('vk/notifications/fetch_local/response', function(e, data) {
        $scope.$apply(function() {
          $scope.notifications = data;
        });
      })
    }

    $scope.login = function(provider) {
      ipcRenderer.send(provider + '/auth/check');
      ipcRenderer.once(provider + '/auth/check/response', function(e, data) {
        if(data.length == 0) {
          ipcRenderer.send(provider + '/auth/login');
          ipcRenderer.once(provider + '/auth/login/response', function(e, data) {
            $scope.providers = addUnique($scope.providers, data);
            $scope.$apply();
          })
        } else {
          $scope.providers = addUnique($scope.providers, data);
          $scope.$apply();
        }
      })
    }

    $scope.fetchProviders = function() {
      ipcRenderer.send('providers/fetch');
      ipcRenderer.once('providers/fetch/response', function(e, data) {
        $scope.providers = addUnique($scope.providers, data);
        $scope.$apply();
        $scope.fetchNotificationsCount();
      })
    }
    $scope.fetchProviders();

    $scope.fetchNotificationsCount = function() {
      $scope.providers.forEach(function(provider) {
        ipcRenderer.send(provider.provider + '/notifications/count');
        ipcRenderer.once(provider.provider + '/notifications/count/response', function(e, data) {
          console.log(data);
          $scope.notificationsCount[provider.provider] = data
          $scope.$apply();
        })
      })

    }
    $scope.fetchNotificationsCount();

    $scope.close = function(data) {
      ngDialog.closeAll(data);
    }

    function addUnique(left, right) {
      if(left.length == 0) {
        return right;
      }

      var buf = left;
      right.forEach(function(entry) {
        left.forEach(function(_entry) {
          if(entry.provider != _entry.provider) {
            buf.push(entry)
          }
        })
      })
      return buf;
    }
	}

})();
