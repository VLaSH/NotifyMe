(function(){
  var electron = require('electron');
  var ipcRenderer = electron.ipcRenderer;
  var $ = require('jQuery');

	angular
		.module('app')
		.controller('NotificationsController', ['$scope', '$stateParams', NotificationsController]);

	function NotificationsController($scope, $stateParams) {
	}

})();
