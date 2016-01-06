(function() {

  'use strict'

  function GoogleMaps($q, $window, $rootScope) {

    var service = {}

    /*
      Create a promise object to be resolved once google maps is
      done loading
    */

    var mapPromise = $q.defer();

    /*
      Initialize the google maps javascript api by appending the
      google maps script tag to the dom - you'll notice you can specify a
      callback function when loading google maps, that runs after the script
      has fully loaded. This way, Angular will initialize, your controller will
      load, and Google maps will be added to the dom when service.createMapElement()
      is called
    */

    service.createMapElement = function() {
      var mapContainer = document.getElementById('maps-container')
      var mapUrl = "https://maps.googleapis.com/maps/api/js?" + "&callback=initializeMap"
      var script = document.createElement('script');
      script.src = mapUrl;
      mapContainer.appendChild(script);
    }
    service.createMapElement()

    /*
      The callback you specify in loading google maps "initializeMap" is attached
      to the window below. This object resolves the mapPromise you defined above.
      This is important because it prevents any of the map related features from
      running before that script tag has loaded.
    */

    window.initializeMap = function() {
      mapPromise.resolve();
    };

    service.mapInitialized = mapPromise.promise

    /*
      This allows you to reference the promise, wait till it returns, and
      run whatever map related functions you want to run for adding markers, etc.

      I saw this in your code a lot... In different controllers, or differnt services,
      you would have to reinitialize map values. If you wrap all of the initial map
      setting logic in a service, you can simply reference the promise that is resolved after:
      1) script for api is set 2) the map center is determined 3) the map element is created

      service.mapActivated is the promise you want to reference (see controller1.js, controller2.js)

      You'll notice if you don't allow geolocation, and you're prompted for an address, the values won't populate
      for each controller until that address is set or your alert is cancelled...
      That's because mapInitialized hasn't been resolved
    */

    var mapActivated = $q.defer()
    service.mapActivated = mapActivated.promise

    /*
      In addition to the promise we've created to ensure maps is loaded before
      trying to create a new map (i.e. new google.maps.Map), we need to make sure
      we have a center to initialize that map with. Since Google's geolocation service
      and I suspect the window objects getCurrentPosition method are async, we
      wrap getCenter in a promise as well, to ensure that we have either 1) gotten
      a center lat lng from Google or 2) have returned a current position from the
      browser
    */

    // Initialize google maps...
    service.mapInitialized.then(function() {
      // Now that the google api has loaded we get our map center...
      service.getCenter().then(function(center) {
        // Now that we have our map center, we actually set the map element
        service.setMapElement(center)
      })
    })

    // Pass in a center based on the promise resolution in getCenter
    service.setMapElement = function(center) {
      var mapOptions = {
        center: center,
        zoom: 20,
        mapTypeId: google.maps.MapTypeId.HYBRID
      }
      service.map = new google.maps.Map(document.getElementById('map'), mapOptions)
      mapActivated.resolve()
    }

    /*

      This is really the crux of your initial question - how do I preload a center
      for google maps if there is no geolocation enabled or the user doesn't allow it?
      I would say do two things:

      1) Ask them for an address; I'm using prompt here because its easy but
         you could provide a pop up that utilizes the GooglePlaces API (look it up, its super easy to use), and essentially
         ensures that the address they provide is compliant with google maps

      2) If the address they provide isn't in the right format or doesn't exist,
         then you return some preset lat lng value like you had before

    */

    service.getCenter = function() {
      var center
      var def = $q.defer()
      $window.navigator.geolocation.getCurrentPosition(

        /*
          if the user allows you to use their geocoded address, great, set the map
          center at that location and resolve your getCenter promise with that center
        */

        function(res) {
          center = new google.maps.LatLng(res.coords.latitude, res.coords.longitude)
          def.resolve(center)
        },

        /*
          If the user doesn't allow you to use their geocoded address, well, ask them for it
          with prompt and if they don't give you a valid address, then you simply return
          a preset LatLng... Just make sure its specific enough, given your current zoom level
        */

        function(err) {
          var address = window.prompt('Please insert an address for your initial location')
          var geocoder = new google.maps.Geocoder()

          geocoder.geocode({
            'address': address
          }, function(res, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              center = res[0].geometry.location
            } else {
              center = new google.maps.LatLng(37.773972, -122.431297)
            }
            def.resolve(center)
          })

        }
      )
      return def.promise
    }

    return service
  }

  GoogleMaps.$inject = ['$q', '$window', '$rootScope']

  app.service('GoogleMaps', GoogleMaps)

}());
