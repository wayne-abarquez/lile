(function(){
'use strict';

angular.module('demoApp')
    .controller('gmapController', ['$rootScope', 'gmapServices', 'ZONES', gmapController]);

    function gmapController($rootScope, gmapServices, ZONES) {

        var vm = this;

        var zones = [];
        //var drawingManager, overlay;

        var zoneInfowindow = gmapServices.createInfoWindow('');

        vm.initialize = initialize;

        vm.initialize();

        function initialize () {
            gmapServices.createMap('map-canvas');

            loadZones();

            //initDrawingManager();

            //gmapServices.addMapListener('click', function(e){
            //   console.log('LatLng: ', e.latLng.toJSON());
            //});

            $rootScope.$on('toggle-zone-layer', function(e, params){
                toggleZones(params.zoneNumber);
            });
        }

        function toggleZones(zoneNumber) {
            var foundZone = _.findWhere(zones, {name: zoneNumber});
            if(foundZone) {
                if(foundZone.polygon && foundZone.polygon.getMap()) {
                    gmapServices.hidePolygon(foundZone.polygon);
                } else {
                    gmapServices.showPolygon(foundZone.polygon);
                }
            }
        }

        /* TODO: extract to service */
        function loadZones () {
            var zonePolyOpts = {
                fillOpacity: 0.3,
                strokeOpacity: 0.5,
                strokeWeight: 0.5
            };

            ZONES.forEach(function(zone){
                var polyOpts = angular.extend(zonePolyOpts, {
                    strokeColor: zone.color,
                    fillColor: zone.color
                });
                var poly = gmapServices.createPolygon(zone.path, polyOpts);

                gmapServices.hidePolygon(poly);

                gmapServices.addListener(poly, 'click', function(){
                    zoneInfowindow.setContent('<h2><b>Zone ' + zone.name + '</b></h2>');
                    zoneInfowindow.setPosition(gmapServices.getPolygonCenter(this));
                    gmapServices.showInfoWindow(zoneInfowindow);
                    //console.log('poly path: ', JSON.stringify(this.getPath().getArray()));
                });

                zones.push({
                    id: zone.id,
                    name: zone.name,
                    polygon: poly
                });
            });
        }

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