app.config(function($stateProvider) {
  var dashboard = {
    name: 'dashboard',
    url: '/dashboard',
    templateUrl: '../views/dashboard.jade',
    controller: 'DashboardsController'
  }

  var notifications = {
    name: 'notifications',
    url: '/notifications:provider',
    templateUrl: '../views/notifications.jade',
    controller: 'NotificationsController'
  }

  $stateProvider.state(dashboard);
  $stateProvider.state(notifications);
});
