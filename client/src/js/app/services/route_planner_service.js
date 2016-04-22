(function(){
'use strict';

angular.module('demoApp')
    .factory('routePlannerService', ['gmapServices', 'DEST_MARKER_BASE_PATH', routePlannerService]);

    function routePlannerService (gmapServices, DEST_MARKER_BASE_PATH) {
        var service = {};

        var dropDestinationListener;

        service.destinationCtr = 0;
        service.destinations = [];

        service.initialize = initialize;
        service.clearRoutes = clearRoutes;
        service.endService = endService;

        function initialize () {
            // set cursor to crosshair
            gmapServices.setMapTargetCursor();
            // initialize destination adding when map is clicked
            activateDropDestinationPoints();
        }

        function activateDropDestinationPoints() {
            dropDestinationListener = gmapServices.addMapListener('click', function (e) {
                var num = generateDestinationNumber();

                var latLng = e.latLng,
                    icon = generateDestinationMarker(num)
                ;

                service.destinations.push({
                    number: num,
                    coordinates: latLng,
                    marker: gmapServices.initMarker(latLng, icon)
                });
            });
        }

        function clearRoutes() {
            service.destinations.forEach(function (d) {
                gmapServices.hideMarker(d.marker);
            });
            service.destinations = [];
            service.destinationCtr = 0;
        }

        function terminateDestinationListener() {
            google.maps.event.removeListener(dropDestinationListener);
            dropDestinationListener = null;
        }

        function endService() {
            terminateDestinationListener();
            gmapServices.setMapDefaultCursor();
        }


        function generateDestinationNumber() {
            return ++service.destinationCtr;
        }

        function generateDestinationMarker(num) {
            return DEST_MARKER_BASE_PATH + 'number_' + num + '.png';
        }

        return service;
    }
}());