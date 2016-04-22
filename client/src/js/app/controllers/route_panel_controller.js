(function () {
    'use strict';

    angular.module('demoApp')
        .controller('routePanelController', ['$rootScope', 'gmapServices', 'DEST_MARKER_BASE_PATH', routePanelController]);

    function routePanelController($rootScope, gmapServices, DEST_MARKER_BASE_PATH) {
        var vm = this;

        var dropDestinationListener,
            destinationCtr = 0;

        var destinations = [];

        vm.initialize = initialize;
        vm.clearRoutes = clearRoutes;

        vm.initialize();

        /* Controller Functions here */

        function initialize() {
            $rootScope.$on('route-panel-opened', function(){
                // set cursor to crosshair
                gmapServices.setMapTargetCursor();
                // initialize destination adding when map is clicked
                activateDropDestinationPoints();
            });
        }

        function clearRoutes () {
            destinations.forEach(function(d){
                gmapServices.hideMarker(d.marker);
            });
            destinations = [];
            destinationCtr = 0;
        }

        function activateDropDestinationPoints () {
            dropDestinationListener = gmapServices.addMapListener('click', function(e){
                var num = generateDestinationNumber();

                var latLng = e.latLng,
                    icon = generateDestinationMarker(num)
                ;

                destinations.push({
                    number: num,
                    coordinates: latLng,
                    marker: gmapServices.initMarker(latLng, icon)
                });
            });
        }

        function generateDestinationNumber () {
            return ++destinationCtr;
        }

        function generateDestinationMarker(num) {
            return DEST_MARKER_BASE_PATH + 'number_' + num + '.png';
        }
    }
}());