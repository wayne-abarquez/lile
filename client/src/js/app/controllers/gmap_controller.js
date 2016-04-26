(function(){
'use strict';

angular.module('demoApp')
    .controller('gmapController', ['$rootScope', 'gmapServices', 'zoneServices', 'truckServices', gmapController]);

    function gmapController($rootScope, gmapServices, zoneServices, truckServices) {

        var vm = this;

        vm.initialize = initialize;

        vm.initialize();

        function initialize () {
            gmapServices.createMap('map-canvas');

            zoneServices.initialize();
            truckServices.initialize();

            $rootScope.$on('toggle-zone-layer', function(e, params){
                zoneServices.toggleZones(params.zoneNumber);
            });
        }

    }
}());