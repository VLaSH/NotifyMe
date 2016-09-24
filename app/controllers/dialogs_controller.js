(function(){
  console.log('ololol');
  var electron = require('electron');
  var ipcRenderer = electron.ipcRenderer;
  var $ = require('jQuery');

	angular
		.module('app')
		.controller('DialogsController', ['$scope', 'ngDialog', DialogsController]);

	function DialogsController($scope, ngDialog) {
    $scope.allProviders = ['vk'];
    $scope.activeProviders = $scope.ngDialogData.providers;

    $scope.close = function(data) {
      ngDialog.closeAll(data);
    }

    $scope.providers = function() {
      var providers = [], buf;
      $scope.allProviders.forEach(function(entry) {
        buf = entry;
        $scope.activeProviders.forEach(function(_entry) {
          if(entry == _entry.provider) {
            buf = null;
          }
        })
        if(buf) {
          providers.push(buf);
        }
      })
      return providers;
    }
	}

})();
