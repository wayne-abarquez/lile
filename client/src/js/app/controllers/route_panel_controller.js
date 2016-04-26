(function () {
    'use strict';

    angular.module('demoApp')
        .controller('routePanelController', ['$scope', '$rootScope', '$timeout', 'gmapServices', 'routePlannerService', routePanelController]);

    function routePanelController($scope, $rootScope, $timeout, gmapServices, routePlannerService) {
        var vm = this;

        vm.destinations = {};

        vm.place = '';

        vm.hasDestination = false;

        vm.initialize = initialize;
        vm.addSelectedPlace = addSelectedPlace;
        vm.clearRoutes = clearRoutes;
        vm.onClickDestinationItem = onClickDestinationItem;
        vm.removeDestination = removeDestination;

        vm.calculateFastestRoundtrip = calculateFastestRoundtrip;
        vm.calculateFastestAZTrip = calculateFastestAZTrip;

        vm.initialize();

        /* Controller Functions here */

        function initialize() {
            $rootScope.$on('route-panel-opened', function(){
                // set cursor to crosshair
                // initialize destination adding when map is clicked
                routePlannerService.initialize();
            });

            $rootScope.$on('new-destination', function(e, params){
                var zoneNo = params.zone,
                    destination = params.destination;

                if(!vm.destinations[zoneNo]) vm.destinations[zoneNo] = [];

                $scope.$apply(function () {
                    addDestination(zoneNo, destination);
                });
            });

            $scope.$watch(function(){
                return vm.hasDestination;
            }, function(newValue, oldValue){
                if(newValue === oldValue) return;
                $("ul.collapsible > li.li-parent-destinations-list > .collapsible-header").trigger('click');
            });

            $scope.$watchCollection(function(){
              return vm.destinations;
            }, function(newValue) {
                if(_.isEmpty(newValue)) {
                    vm.hasDestination = false;
                    return;
                } else {
                    for(var zoneNo in newValue) {
                        if(newValue[zoneNo].length > 0) {
                            vm.hasDestination = true;
                            return;
                        }
                    }
                    vm.hasDestination = false;
                }
            });
        }

        /* Place Functions */
        function addSelectedPlace() {
            $timeout(function(){
                routePlannerService.addPlaceDestination();
                vm.place = '';
            });
        }

        /* Destination Functions */

        function clearRoutes () {
            routePlannerService.clearRoutes();
            vm.destinations = {};
        }

        function onClickDestinationItem (latLng) {
            gmapServices.panTo(latLng);
        }

        function removeDestination(destNo, zoneNo) {
            routePlannerService.removeDestination(destNo, zoneNo);
            vm.destinations[zoneNo].forEach(function(destination, index){
                if (destination.number == destNo) {
                    vm.destinations[zoneNo].splice(index, 1);
                    updateDestinations(zoneNo);
                    return;
                }
            });
        }

        function updateDestinations (zoneNo) {
            vm.destinations[zoneNo] = [];
            routePlannerService.destinations[zoneNo].forEach(function (destination, index) {
                addDestination(zoneNo, destination);
            });
        }

        function addDestination(zoneNo, destination) {
            var coordinates = destination.coordinates.toJSON();
            var location = '(' + coordinates['lat'] + ', ' + coordinates['lng'] + ')';
            vm.destinations[zoneNo].push({
                number: destination.number,
                latLng: coordinates,
                icon: destination.marker.getIcon(),
                location: location
            });
        }

        /* Calculate Route Functions */

        function calculateFastestRoundtrip () {
            routePlannerService.calculateFastestRoundtrip();
        }

        function calculateFastestAZTrip () {
            routePlannerService.calculateFastestAZTrip();
        }

    }
}());