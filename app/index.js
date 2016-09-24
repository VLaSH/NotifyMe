var app = angular.module('app', ['ngDialog', 'ui.router']);

app.run(['$state', function($state) {
  $state.go('dashboard');
}]);
