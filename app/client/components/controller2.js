(function() {

  'use strict'

  function AnotherController($scope, $q, $window, $rootScope, GoogleMaps) {
    GoogleMaps.mapActivated.then(function() {
      console.log('running functions on an active map from another controller...')
      $scope.anotherValue = "Another value set after the map was activated..."
    })
  }

  AnotherController.$inject = ['$scope', '$q', '$window', '$rootScope', 'GoogleMaps']

  app.controller('AnotherController', AnotherController)

}());
