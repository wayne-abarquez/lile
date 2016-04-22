(function () {
    'use strict';

    angular.module('demoApp')
        .controller('routePanelController', ['$rootScope', 'gmapServices', 'routePlannerService', routePanelController]);

    function routePanelController($rootScope, gmapServices, routePlannerService) {
        var vm = this;

        var autocompleteDestination;

        vm.initialize = initialize;
        vm.clearRoutes = clearRoutes;

        vm.initialize();

        /* Controller Functions here */

        function initialize() {
            autocompleteDestination = gmapServices.initializeAutocomplete('destination-address-input');
            autocompleteDestination.addListener('place_changed', destinationAutocompleteChangeCallback);

            $rootScope.$on('route-panel-opened', function(){
                // set cursor to crosshair
                // initialize destination adding when map is clicked
                routePlannerService.initialize();
            });
        }

        function destinationAutocompleteChangeCallback () {
            var place = autocompleteDestination.getPlace();
            if ( !place.geometry) {
                alert("Autocomplete's returned place contains no geometry");
                return;
            }
            // If the place has a geometry, then present it on a map.
            if ( place.geometry.viewport) {
                gmapServices.map.fitBounds(place.geometry.viewport);
            } else {
                gmapServices.map.setCenter(place.geometry.location);
                gmapServices.map.setZoom(15);
            }
        }

        function clearRoutes () {
            routePlannerService.clearRoutes();
        }

    }
}());