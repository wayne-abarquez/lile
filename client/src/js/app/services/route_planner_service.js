(function(){
'use strict';

angular.module('demoApp')
    .factory('routePlannerService', ['DEST_MARKER_BASE_PATH', '$rootScope', '$timeout', '$q', 'gmapServices', 'zoneServices', 'truckServices', 'alertServices', 'loaderServices', routePlannerService]);

    function routePlannerService (DEST_MARKER_BASE_PATH, $rootScope, $timeout, $q, gmapServices, zoneServices, truckServices, alertServices, loaderServices) {
        var service = {};

        var autocompleteDestination;
        var selectedPlace = {
            latLng: null
        };

        var zoneNo = 1;

        var dropDestinationListener;
        service.destinationCtr = {};
        service.destinations = {};

        service.initialize = initialize;
        service.clearRoutes = clearRoutes;
        service.endService = endService;
        service.removeDestination = removeDestination;
        service.addPlaceDestination = addPlaceDestination;
        service.calculateFastestRoundtrip = calculateFastestRoundtrip;
        service.insertBulkDestinationAddress = insertBulkDestinationAddress;
        //service.calculateFastestAZTrip = calculateFastestAZTrip;

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

                loaderServices.showLoader();
                pushDestination(e.latLng)
                    .finally(function(){
                        loaderServices.hideLoader();
                    });
            });
        }

        function isAddressExist (address) {
            var addressExist = false;

            if(!service.destinations) return addressExist;

            for(var zoneNo in service.destinations) {
                service.destinations[zoneNo].forEach(function (dest) {
                    if (dest.address == address) {
                        addressExist = true;
                        return;
                    }
                });
            }

            return addressExist;
        }

        function pushDestination (latLng, address) {
            var dfd = $q.defer();

            var zoneNo = zoneServices.getZoneNoForLatLng(latLng);

            if (zoneNo !== false) {
                var ctr = generateDestinationNumber(zoneNo);
                var icon = generateDestinationMarker(ctr, zoneNo);

                if (isAddressExist(address)) {
                    console.log('Address already exist: ', address);
                    dfd.reject();
                    return dfd.promise;
                }

                var data = {
                    number: ctr,
                    coordinates: latLng,
                    marker: gmapServices.initMarker(latLng, icon)
                };

                // if address not specified geocode latLng to string address
                if (!address) {
                    gmapServices.reverseGeocode(latLng)
                        .then(function (response) {
                            var responseAddress = response.formatted_address;

                            if (isAddressExist(responseAddress)) {
                                console.log('Address already exist: ', responseAddress);
                                dfd.reject();
                                return dfd.promise;
                            } else {
                                $timeout(function () {
                                    data['address'] = responseAddress;
                                    addDestination(data, zoneNo);
                                    dfd.resolve();
                                });
                            }
                        }, function () {
                            dfd.reject();
                        });
                } else {
                    data['address'] = address;
                    addDestination(data, zoneNo);
                    dfd.resolve();
                }
            } else {
                alertServices.showZoneLocationInvalid();
                dfd.reject();
            }

            return dfd.promise;
        }

        function addPlaceDestination () {
            if (selectedPlace.latLng) {

                loaderServices.showLoader();
                pushDestination(selectedPlace.latLng, selectedPlace.address)
                    .finally(function () {
                        loaderServices.hideLoader();
                    });

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

        var addressCtr = 0;

        // recursive call
        function addByAddress (addressArray) {
            if(addressCtr >= addressArray.length) {
                addressCtr = 0;
                loaderServices.hideLoader();
                return;
            }

            try {
                gmapServices.geocodeAddress(addressArray[addressCtr])
                    .then(function (response) {
                        if (!response) {
                            console.log('no result on geocoding');
                        }
                        $timeout(function () {
                            pushDestination(response.geometry.location, addressArray[addressCtr]);
                        });
                    }, function (error) { console.log('Error on Geocoding Address: ', error); })
                    .finally(function () {
                        addressCtr++;
                        addByAddress(addressArray);
                    });
            } catch(err) {  }
        }

        function insertBulkDestinationAddress(addressArray) {
            if(!addressArray || addressArray.length <= 0) {
                alert('Must have atleast 1 address.');
                return;
            }

            loaderServices.showLoader();
            addByAddress(addressArray);
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

            for (var zoneNo in directionsRenderers) {
                if(directionsRenderers[zoneNo] && directionsRenderers[zoneNo].getMap()) {
                    directionsRenderers[zoneNo].setMap(null);
                }
            }

            zoneNo = 1;
            truckServices.hideTrucks();
            //gmapServices.tsp.startOver();
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

            selectedPlace.address = place.formatted_address;
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

        //function calculateRoute (solveFunc) {
        //    for (var zoneNo in service.destinations) {
        //        // If directions renderer not instantiated
        //        // initialize it for each zones
        //        // directionsRenderer with different poly colors based on the zones
        //        if (!directionsRenderers[zoneNo]) {
        //            var polyColor = zoneServices.getZoneColor(zoneNo);
        //            directionsRenderers[zoneNo] = gmapServices.createDirectionsRenderer(polyColor);
        //        }
        //
        //        // get the truck location per zone
        //        // and push to first index
        //        var truck = truckServices.getTruckByZoneNo(zoneNo);
        //
        //        // sort destination based on the order numbering
        //        //var sortedDestinations = _.sortBy(service.destinations[zoneNo], 'number');
        //        var sortedDestinations = service.destinations[zoneNo].slice();
        //
        //        sortedDestinations.unshift({
        //            coordinates: gmapServices.castLatLngLitToObj(truck.location)
        //        });
        //
        //        //gmapServices.tsp.removeWaypoints();
        //        gmapServices.tsp.startOver();
        //
        //        // Add waypoints on tsp service
        //        sortedDestinations.forEach(function (dest) {
        //            gmapServices.tsp.addWaypoint(dest.coordinates, function () {});
        //        });
        //
        //        // show trucks per zone
        //        solveFunc(zoneNo);
        //    }
        //}

        function processCoordinates (truckLatLng, coords) {
            var waypoints = [];

            coords.forEach(function(coords){
                waypoints.push({
                    location: coords.coordinates,
                    stopover: true
                });
            });

            var truckLocation = gmapServices.castLatLngLitToObj(truckLatLng);

            return {
                origin: truckLocation,
                destination: truckLocation,
                waypoints: waypoints
            };
        }

        // this is a recursive function
        function calculateRoute(solveFunc) {
            if(zoneNo > 6) {
                zoneNo = 1;
                loaderServices.hideLoader();
                return;
            }

            try {
            //for (var zoneNo in service.destinations) {
                // If directions renderer not instantiated
                // initialize it for each zones
                // directionsRenderer with different poly colors based on the zones
                if (!directionsRenderers[zoneNo]) {
                    var polyColor = zoneServices.getZoneColor(zoneNo);
                    directionsRenderers[zoneNo] = gmapServices.createDirectionsRenderer(polyColor);
                } else {
                    if(directionsRenderers[zoneNo] && !directionsRenderers[zoneNo].getMap()) {
                        directionsRenderers[zoneNo].setMap(gmapServices.map);
                    }
                }

                // get the truck location per zone
                // and push to first index
                var truck = truckServices.getTruckByZoneNo(zoneNo);

                // sort destination based on the order numbering
                //var sortedDestinations = _.sortBy(service.destinations[zoneNo], 'number');
                var sortedDestinations = service.destinations[zoneNo].slice();

                var destLocations = processCoordinates(truck.location, sortedDestinations);

                truckServices.showTruckByZoneNo(zoneNo);
                gmapServices.computeRoute(destLocations, directionsRenderers[zoneNo])
                    .finally(function(){
                        zoneNo++;
                        calculateRoute(solveFunc);
                    });

                //sortedDestinations.unshift({
                //    coordinates: gmapServices.castLatLngLitToObj(truck.location)
                //});

                //gmapServices.tsp.removeWaypoints();
                //gmapServices.tsp.startOver();

                // Add waypoints on tsp service
                //sortedDestinations.forEach(function (dest) {
                //    gmapServices.tsp.addWaypoint(dest.coordinates, function () {
                //    });
                //});

                // show trucks per zone
                solveFunc(zoneNo);
            //}
            } catch (err) {
                zoneNo++;
                calculateRoute(solveFunc);
            }
        }


        function calculateFastestRoundtrip () {
            var solveFunction = function (zoneNo) {
                //gmapServices.tsp.solveRoundTrip(function (tsp) {
                //    var dir = gmapServices.tsp.getGDirections();
                //    directionsRenderers[zoneNo].setDirections(dir);
                //});
            };

            loaderServices.showLoader();
            calculateRoute(solveFunction);
        }

        //function calculateFastestAZTrip () {
        //    var solveFunction = function (zoneNo) {
        //        //gmapServices.tsp.solveAtoZ(function (tsp) {
        //        //    var dir = gmapServices.tsp.getGDirections();
        //        //    directionsRenderers[zoneNo].setDirections(dir);
        //        //});
        //    };
        //    calculateRoute(solveFunction);
        //}


        return service;
    }
}());