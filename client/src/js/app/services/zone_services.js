(function(){
'use strict';

angular.module('demoApp')
    .factory('zoneServices', ['gmapServices', 'ZONES', zoneServices]);

    function zoneServices (gmapServices, ZONES) {
        var service = {};

        var zoneInfowindow = gmapServices.createInfoWindow('');

        var zonePolyOpts = {
            fillOpacity: 0.3,
            strokeOpacity: 0.5,
            strokeWeight: 0.5
        };

        service.zones = [];

        service.initialize = initialize;
        service.toggleZones = toggleZones;
        service.getZoneNoForLatLng = getZoneNoForLatLng;
        service.getZoneColor = getZoneColor;

        function initialize () {
            loadZones();
        }

        function loadZones() {
            ZONES.forEach(function (zone) {
                createZone(zone);
            });
        }

        function createZone(zone){
            var polyOpts = angular.extend(zonePolyOpts, {
                strokeColor: zone.color,
                fillColor: zone.color
            });
            var poly = gmapServices.createPolygon(zone.path, polyOpts);

            gmapServices.hidePolygon(poly);

            gmapServices.addListener(poly, 'click', function () {
                zoneInfowindow.setContent('<h2><b>Zone ' + zone.name + '</b></h2>');
                zoneInfowindow.setPosition(gmapServices.getPolygonCenter(this));
                gmapServices.showInfoWindow(zoneInfowindow);
            });

            service.zones.push({
                id: zone.id,
                name: zone.name,
                polygon: poly
            });
        }

        function toggleZones(zoneNumber) {
            var foundZone = _.findWhere(service.zones, {name: zoneNumber});
            if(foundZone) {
                if(foundZone.polygon && foundZone.polygon.getMap()) {
                    gmapServices.hidePolygon(foundZone.polygon);
                } else {
                    gmapServices.showPolygon(foundZone.polygon);
                }
            }
        }

        function getZoneNoForLatLng (latLng) {
            var zoneNo = false;
            service.zones.forEach(function(z){
                if(gmapServices.isLocationWithinPolygon(latLng, z.polygon)) {
                    zoneNo = z.name;
                    return;
                }
            });
            return zoneNo;
        }

        function getZoneColor (zoneNo) {
            var foundZone = _.findWhere(ZONES, {name: zoneNo});
            return foundZone.color;
        }

        return service;
    }
}());