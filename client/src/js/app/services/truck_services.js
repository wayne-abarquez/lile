(function(){
'use strict';

angular.module('demoApp')
    .factory('truckServices', ['TRUCK_HQ', 'TRUCK_ICON', 'gmapServices',  truckServices]);

    function truckServices (TRUCK_HQ, TRUCK_ICON, gmapServices) {
        var service = {};

        service.trucks = [];

        service.initialize = initialize;
        service.toggleTrucks = toggleTrucks;

        function initialize () {
            loadTrucks();
        }

        function loadTrucks() {
            TRUCK_HQ.forEach(function(truck){
                angular.extend(truck, {
                    marker: gmapServices.initMarker(truck.location, TRUCK_ICON)
                });
                gmapServices.hideMarker(truck.marker);
                service.trucks.push(truck);
            });

        }

        function toggleTrucks () {
            service.trucks.forEach(function (truck) {
                if(truck.marker && truck.marker.getMap()) {
                    gmapServices.hideMarker(truck.marker);
                } else {
                    gmapServices.showMarker(truck.marker);
                }
                return;
            });
        }

        return service;
    }
}());