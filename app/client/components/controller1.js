(function() {

  'use strict'

  function SomeController($scope, $q, $window, $rootScope, GoogleMaps) {
    GoogleMaps.mapActivated.then(function() {
      console.log('running functions on an activated map from some controller...')
      $scope.someValue = "Some value set after the map was activated..."
    })
  }

  SomeController.$inject = ['$scope', '$q', '$window', '$rootScope', 'GoogleMaps']
  app.controller('SomeController', SomeController)

}());
