(function(){
'use strict';

angular.module('demoApp')
    .factory('layerGmapServices', ['gmapServices', layerGmapServices]);

    function layerGmapServices (gmapServices) {
        var service = {};

        service.map = null;
        service.overlayView = null;

        service.createMap = createMap;
        service.destroyMap = destroyMap;
        service.showDrawingManager = showDrawingManager;
        service.addMapListener = addMapListener;
        service.setMapCursorCrosshair = setMapCursorCrosshair;
        service.setMapCursorDefault = setMapCursorDefault;
        service.fromLatLngToContainerPixel = fromLatLngToContainerPixel;
        service.fromLatLngToDivPixel = fromLatLngToDivPixel;
        service.loadKMLByURL = loadKMLByURL;
        service.showInfoWindow = showInfoWindow;
        service.createCanvasInfoWindow = createCanvasInfoWindow;
        service.hideCanvasInfoWindow = hideCanvasInfoWindow;
        service.createMarker = createMarker;
        service.createPolyline = createPolyline;
        service.createCircle = createCircle;
        service.createPolygon = createPolygon;
        service.createRectangle = createRectangle;
        service.showLayer = showLayer;

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

            var overlayView = new google.maps.OverlayView();
            overlayView.draw = function () {
            };
            overlayView.setMap(service.map);
            service.overlayView = overlayView;

            return service.map;
        }

        function destroyMap () {
            service.map = null;
        }

        function showDrawingManager(drawingManager) {
            if(drawingManager && !drawingManager.getMap()) drawingManager.setMap(service.map);

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

        function fromLatLngToContainerPixel(latlng) {
            if (service.overlayView) {
                return service.overlayView.getProjection().fromLatLngToContainerPixel(latlng);
            }
            return new google.maps.Point();
        }

        function fromLatLngToDivPixel(latlng) {
            if (service.overlayView) {
                return service.overlayView.getProjection().fromLatLngToDivPixel(latlng);
            }
            return new google.maps.Point();
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

        function showInfoWindow(infoWindow, target) {
            infoWindow.open(service.map, target);
        }

        function createCanvasInfoWindow() {
            if (!gmapServices.apiAvailable()) return null;

            return new CanvasInfoWindow(service.map);
        }

        function hideCanvasInfoWindow(infoWindow) {
            if (infoWindow) infoWindow.hideInfowindow();
        }

        function createMarker(_position, additionalOpts) {
            if (!gmapServices.apiAvailable()) return null;

            var opts = angular.extend({}, {
                position: _position,
                map: service.map
            }, additionalOpts);

            return new google.maps.Marker(opts);
        }

        function createPolyline(path, additionalOpts) {
            if (!gmapServices.apiAvailable()) return null;

            var opts = angular.extend({}, {
                path: path,
                map: service.map
            }, additionalOpts);

            return new google.maps.Polyline(opts);
        }

        function createCircle(center, radius, additionalOpts) {
            if (!gmapServices.apiAvailable()) return null;

            var opts = angular.extend({}, {
                center: center,
                radius: radius,
                map: service.map
            }, additionalOpts);

            return new google.maps.Circle(opts);
        }

        function createPolygon(path, additionalOpts) {
            if (!gmapServices.apiAvailable()) return null;

            var opts = angular.extend({}, {
                path: path,
                map: service.map
            }, additionalOpts);

            return new google.maps.Polygon(opts);
        }

        function createRectangle(bounds, additionalOpts) {
            if (!gmapServices.apiAvailable()) return null;

            var opts = {
                bounds: bounds,
                map: service.map
            };

            angular.merge(opts, additionalOpts);

            return new google.maps.Rectangle(opts);
        }

        function showLayer (layer) {
            if(layer && !layer.getMap()) return layer.setMap(service.map);
        }

        return service;
    }
}());