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

            //initDrawingManager();

            gmapServices.addMapListener('click', function(e){
               console.log('LatLng: ', e.latLng.toJSON());
            });

            $rootScope.$on('toggle-zone-layer', function(e, params){
                zoneServices.toggleZones(params.zoneNumber);
            });
        }

        //var drawingManager, overlay;
        //function initDrawingManager() {
        //    drawingManager = gmapServices.createDrawingManager('#e74c3c');
        //    gmapServices.showDrawingManager(drawingManager);
        //
        //    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        //        var path = event.overlay.getPath();
        //        if(overlay) {
        //            overlay.setPath(path);
        //        } else {
        //            overlay = event.overlay;
        //        }
        //        console.log('overlay complete');
        //    });
        //
        //    $(document).keypress(function (e) {
        //        if (e.which == 32) {
        //            if(overlay) {
        //                console.log('overlay path: ', JSON.stringify(overlay.getPath().getArray()));
        //            }
        //        }
        //    });
        //}

    }
}());