(function(){
'use strict';

angular.module('demoApp')
    .factory('layerGmapServices', ['gmapServices', layerGmapServices]);

    function layerGmapServices (gmapServices) {
        var service = {};

        service.map = null;

        service.createMap = createMap;
        service.destroyMap = destroyMap;
        service.showDrawingManager = showDrawingManager;
        service.addMapListener = addMapListener;
        service.setMapCursorCrosshair = setMapCursorCrosshair;
        service.setMapCursorDefault = setMapCursorDefault;
        service.loadKMLByURL = loadKMLByURL;
        service.createCanvasInfoWindow = createCanvasInfoWindow;
        service.hideCanvasInfoWindow = hideCanvasInfoWindow;

        function createMap(mapId) {
            var mapIdLoc = mapId || 'map3d';

            if (service.map) return service.map;
            if (!gmapServices.apiAvailable()) return null;

            var mapOptions = {
                zoom: gmapServices.defaultZoom,
                minZoom: 2,
                center: gmapServices.defaultLatLng,
                mapTypeId: google.maps.MapTypeId.MAP,
                mapTypeControl: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM
                },
                streetViewControl: false,
                panControl: false,
                clickableIcons: false
            };

            service.map = new google.maps.Map(document.getElementById(mapIdLoc), mapOptions);

            // handle window resize event
            google.maps.event.addDomListener(window, 'resize', function () {
                var center = service.map.getCenter();
                google.maps.event.trigger(service.map, 'resize');
                service.map.setCenter(center);
            });

            return service.map;
        }

        function destroyMap () {
            service.map = null;
        }

        function showDrawingManager(drawingManager) {
            if(!drawingManager) return;

            if (!drawingManager.getMap()) drawingManager.setMap(service.map);

            gmapServices.setEnableDrawingManager(drawingManager, true);
        }

        function addMapListener(eventName, callback) {
            if (service.map) return gmapServices.addListener(service.map, eventName, callback);
            return null;
        }

        function setMapCursorCrosshair() {
            if (service.map) service.map.setOptions({draggableCursor: 'crosshair'});
        }

        function setMapCursorDefault() {
            if (service.map) service.map.setOptions({draggableCursor: null});
        }

        function loadKMLByURL(srcUrl, kmlOptions) {
            if (service.map) {
                var opt = {
                    url: srcUrl,
                    map: service.map,
                    preserveViewport: true
                };
                if (kmlOptions) opt = angular.extend({}, opt, kmlOptions);

                return new google.maps.KmlLayer(opt);
            }
            return null;
        }

        function createCanvasInfoWindow() {
            if (!gmapServices.apiAvailable()) return null;

            return new CanvasInfoWindow(service.map);
        }

        function hideCanvasInfoWindow(infoWindow) {
            if (infoWindow) infoWindow.hideInfowindow();
        };

        return service;
    }
}());