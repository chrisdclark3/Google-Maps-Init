app = angular.module('app', ['ngRoute', 'ui.bootstrap']);

app.constant('HOST', 'http://localhost:6789');

app.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/home', {
    templateUrl: 'views/home.html',
  })
  .otherwise({
    redirectTo: '/home'
  });
}]);
