angular.module('starter').controller('MapController', ['$scope',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicModal',
    '$ionicPopup',
    'LocationsService',
    'InstructionsService',
    function(
        $scope,
        $cordovaGeolocation,
        $stateParams,
        $ionicModal,
        $ionicPopup,
        LocationsService,
        InstructionsService
    ) {
        $scope.$on("$stateChangeSuccess", function() {
            $scope.locations = LocationsService.savedLocations;
            $scope.newLocation;
            if (!InstructionsService.instructions.newLocations.seen) {
                var instructionsPopup = $ionicPopup.alert({
                    title: 'Add Locations',
                    template: InstructionsService.instructions.newLocations.text
                });
                instructionsPopup.then(function(res) {
                    InstructionsService.instructions.newLocations.seen = true;
                });
            }

            $scope.map = {
                defaults: {
                    tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                    maxZoom: 18,
                    minZoom: 2,
                    zoomControlPosition: 'bottomleft'
                },
                markers: {},
                events: {
                    map: {
                        enable: ['context'],
                        logic: 'emit'
                    }
                }
            };
            $scope.goTo(0);
        });
        var Location = function() {
            if (!(this instanceof Location)) return new Location();
            this.lat = "";
            this.lng = "";
            this.name = "";
        };
        $ionicModal.fromTemplateUrl('templates/addLocation.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent) {
            $scope.newLocation = new Location();
            $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
            $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
            $scope.modal.show();
        });
        $scope.$on('leafletDirectiveMap.drag', function(event, locationEvent) {
          /*console.log("lat == " + parseInt($scope.map.center.lat) + " => " + (parseInt($scope.map.center.lat) <= 73));
          console.log("lng ==> " + parseInt($scope.map.center.lng) + " => " + (parseInt($scope.map.center.lng) >= -73));*/
          var lng = parseInt($scope.map.center.lng), lat = parseInt($scope.map.center.lat);
          console.log("lat => " + lat+ " lng => " + lng + " zoom => " + $scope.map.center.zoom);
          if(lat >= 63  /* && lng <= -73*/) { 
            $scope.map.center = {
                lat: 63,
                lng: 50,
                zoom: 2
            };
          }
        });
        $scope.saveLocation = function() {
            LocationsService.savedLocations.push($scope.newLocation);
            $scope.modal.hide();
            $scope.goTo(LocationsService.savedLocations.length - 1);
        };
        $scope.goTo = function(locationKey) {
            var location = LocationsService.savedLocations[locationKey];
            $scope.map.center = {
                lat: location.lat,
                lng: location.lng,
                zoom: 15
            };
            $scope.map.markers[locationKey] = {
                lat: location.lat,
                lng: location.lng,
                message: location.name,
                focus: true,
                draggable: false
            };
        };
        $scope.locate = function() {
            $cordovaGeolocation
                .getCurrentPosition()
                .then(function(position) {
                    $scope.map.center.lat = position.coords.latitude;
                    $scope.map.center.lng = position.coords.longitude;
                    $scope.map.center.zoom = 18;
                    $scope.map.markers.now = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        message: "You Are Here",
                        focus: true,
                        draggable: false
                    };
                }, function(err) {
                    // error
                    console.log("Location error!");
                    console.log(err);
                });
        };
    }
]);