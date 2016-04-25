(function(){
'use strict';

angular.module('demoApp')
    .factory('routePlannerService', ['$rootScope', 'gmapServices', 'DEST_MARKER_BASE_PATH', 'zoneServices', 'alertServices', routePlannerService]);

    function routePlannerService ($rootScope, gmapServices, DEST_MARKER_BASE_PATH, zoneServices, alertServices) {
        var service = {};

        var autocompleteDestination;
        var selectedPlace = {
            latLng: null
        };

        var dropDestinationListener;
        service.destinationCtr = {};
        service.destinations = {};

        service.initialize = initialize;
        service.clearRoutes = clearRoutes;
        service.endService = endService;
        service.removeDestination = removeDestination;
        service.addPlaceDestination = addPlaceDestination;
        service.calculateFastestRoundtrip = calculateFastestRoundtrip;
        service.calculateFastestAZTrip = calculateFastestAZTrip;

        function initialize () {
            autocompleteDestination = gmapServices.initializeAutocomplete('destination-address-input');
            autocompleteDestination.addListener('place_changed', destinationAutocompleteChangeCallback);
            // set cursor to crosshair
            gmapServices.setMapTargetCursor();
            // initialize destination adding when map is clicked
            activateDropDestinationPoints();
        }

        function activateDropDestinationPoints() {
            dropDestinationListener = gmapServices.addMapListener('click', function (e) {
                pushDestination(e.latLng);
            });
        }

        function pushDestination (latLng) {
            var zoneNo = zoneServices.getZoneNoForLatLng(latLng);

            if (zoneNo !== false) {
                var ctr = generateDestinationNumber(zoneNo);
                var icon = generateDestinationMarker(ctr, zoneNo);

                var data = {
                    number: ctr,
                    coordinates: latLng,
                    marker: gmapServices.initMarker(latLng, icon)
                };

                addDestination(data, zoneNo);
            } else {
                alertServices.showZoneLocationInvalid();
            }
        }

        function addPlaceDestination () {
            if (selectedPlace.latLng) {
                pushDestination(selectedPlace.latLng);

                selectedPlace.latLng = null;
            } else {
                alert('Please Enter a Location');
            }
        }

        function addDestination(data, zoneNo) {
            if (!service.destinations[zoneNo]) service.destinations[zoneNo] = [];

            service.destinations[zoneNo].push(data);

            $rootScope.$broadcast('new-destination', {zone: zoneNo, destination: data});
        }

        function removeDestination(destNo, zoneNo) {
            if (!service.destinations[zoneNo]) return;

            service.destinations[zoneNo].forEach(function(destination, index){
                if(destination.number == destNo) {
                    gmapServices.hideMarker(destination.marker);
                    service.destinations[zoneNo].splice(index, 1);
                    return;
                }
            });

            updateDestinations(zoneNo);
        }

        function updateDestinations(zoneNo) {
            service.destinations[zoneNo].forEach(function (destination, index) {
                var newNo = index + 1;
                destination.number = newNo;
                destination.marker.setIcon(generateDestinationMarker(newNo, zoneNo));
            });
        }

        function clearRoutes() {
            for(var zoneNo in service.destinations) {
                if(service.destinations[zoneNo] && service.destinations[zoneNo].length) {
                    service.destinations[zoneNo].forEach(function (d) {
                        gmapServices.hideMarker(d.marker);
                    });
                }
            }

            service.destinations = {};

            for (var zoneNo in service.destinationCtr) {
                if(service.destinationCtr[zoneNo]) {
                    service.destinationCtr[zoneNo] = 0;
                }
            }
        }

        function terminateDestinationListener() {
            gmapServices.removeListener(dropDestinationListener);
            dropDestinationListener = null;
        }

        function endService() {
            terminateDestinationListener();
            gmapServices.setMapDefaultCursor();
        }

        function generateDestinationNumber(zoneNo) {
            if (!service.destinations[zoneNo]) service.destinations[zoneNo] = [];

            return service.destinations[zoneNo].length + 1;
        }

        function generateDestinationMarker(destCtr, zoneNo) {
            return DEST_MARKER_BASE_PATH + zoneNo + '/number_' + destCtr + '.png';
        }


        /* PLACE FUNCTIONS */

        function destinationAutocompleteChangeCallback() {
            var place = autocompleteDestination.getPlace();
            if (!place.geometry) {
                alert("Autocomplete's returned place contains no geometry");
                return;
            }

            selectedPlace.latLng = place.geometry.location;

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                gmapServices.map.fitBounds(place.geometry.viewport);
            } else {
                gmapServices.map.setCenter(selectedPlaceCoordinates);
                gmapServices.map.setZoom(15);
            }
        }

        /* Calculate Route Functions */

        var directionsRenderers = {};

        function calculateFastestRoundtrip () {
            console.log('calculateFastestRoundtrip');
            for (var zoneNo in service.destinations) {
                if(!directionsRenderers[zoneNo]) {
                    var polyColor = zoneServices.getZoneColor(zoneNo);
                    directionsRenderers[zoneNo] = gmapServices.createDirectionsRenderer(polyColor);
                }

                var sortedDestinations = _.sortBy(service.destinations[zoneNo], 'number');
                sortedDestinations.forEach(function(dest){
                    gmapServices.tsp.addWaypoint(dest.coordinates, function(){});
                });

                gmapServices.tsp.solveRoundTrip(function(e){
                    var dir = gmapServices.tsp.getGDirections();
                    directionsRenderers[zoneNo].setDirections(dir);
                    gmapServices.tsp.removeWaypoints();
                });
            }
        }

        function calculateFastestAZTrip () {
            console.log('calculateFastestAZTrip');
            for (var zoneNo in service.destinations) {
                if (!directionsRenderers[zoneNo]) {
                    var polyColor = zoneServices.getZoneColor(zoneNo);
                    console.log('zone ' + zoneNo + ' : ' + polyColor);
                    directionsRenderers[zoneNo] = gmapServices.createDirectionsRenderer(polyColor);
                }

                var sortedDestinations = _.sortBy(service.destinations[zoneNo], 'number');
                sortedDestinations.forEach(function (dest) {
                    gmapServices.tsp.addWaypoint(dest.coordinates, function () {
                        console.log('added waypoint for zone: ', zoneNo);
                    });
                });

                gmapServices.tsp.solveAtoZ(function (e) {
                    var dir = gmapServices.tsp.getGDirections();
                    directionsRenderers[zoneNo].setDirections(dir);
                    gmapServices.tsp.removeWaypoints();
                });
            }
        }


        return service;
    }
}());