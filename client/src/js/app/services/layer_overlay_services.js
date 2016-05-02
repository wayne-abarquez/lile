(function(){
'use strict';

angular.module('demoApp')
    .factory('layerOverlayServices', ['layerGmapServices', 'infoWindowServices', layerOverlayServices]);

    function layerOverlayServices (layerGmapServices, infoWindowServices) {
        var service = {};

        service.overlays = {};

        service.loadOverlay = loadOverlay;
        service.hideOverlay = hideOverlay;
        service.showOverlay = showOverlay;
        service.destroyOverlays = destroyOverlays;

        function loadOverlay (overlayData) {
            var overlay = null;

            // reset overlays
            service.overlays = {};

            infoWindowServices.clearInfoWindows();

            console.log('loadOverlay overlayData: ', overlayData);

            for(var shapeType in overlayData) {
                if(overlayData.hasOwnProperty(shapeType)) {
                    overlay = overlayData[shapeType];

                    if(shapeType == google.maps.drawing.OverlayType.MARKER)
                        loadMarkers(overlay);
                    else if(shapeType == google.maps.drawing.OverlayType.POLYLINE)
                        loadPolylines(overlay);
                    else if (shapeType == google.maps.drawing.OverlayType.CIRCLE)
                        loadCircles(overlay);
                    else if (shapeType == google.maps.drawing.OverlayType.POLYGON)
                        loadPolygons(overlay);
                    else if (shapeType == google.maps.drawing.OverlayType.RECTANGLE)
                        loadRectangles(overlay);
                    else if (shapeType == 'infowindow')
                        loadInfoWindows(overlayData['infowindow']);
                }
            }

            //try {
            //    if(overlayData['infowindow']) loadInfoWindows(overlayData['infowindow']);
            //}catch(err) { console.log('exception on loadOverlay: ',err); }
        }

        function hideOverlay () {
            for(var shapeType in service.overlays) {
                if (shapeType == 'infowindow') {
                    infoWindowServices.clearInfoWindows();
                } else {
                    service.overlays[shapeType].forEach(function (overlay) {
                        if (overlay && overlay.getMap())  overlay.setMap(null);
                    });
                }
            }
        }

        function showLayer(overlay) {
            layerGmapServices.showLayer(overlay);
            //if(typeof overlay.setDraggable == 'function') overlay.setDraggable(false);
            //overlay.setDraggable && overlay.setDraggable(false);
            //overlay.setEditable && overlay.setEditable(false);
            var properties = ['editable', 'draggable', 'clickable'];
            for(var prop in properties) {
                if(overlay.hasOwnProperty(prop)) {
                    overlay[prop] = false;
                }
            }
        }

        function showOverlay () {
            for (var shapeType in service.overlays) {
                if (shapeType != 'infowindow') {
                    service.overlays[shapeType].forEach(function (overlay) {
                        showLayer(overlay);
                    });
                } else {
                    infoWindowServices.showInfoWindows();
                }
            }
        }

        function destroyOverlays () {
            hideOverlay();
            service.overlays = {};
        }

        function loadMarkers (dataArray) {
            if(!service.overlays[google.maps.drawing.OverlayType.MARKER]) service.overlays[google.maps.drawing.OverlayType.MARKER] = [];

            dataArray.forEach(function(item){
                service.overlays[google.maps.drawing.OverlayType.MARKER].push(
                    layerGmapServices.createMarker(item.position)
                )
            });
        }

        function loadPolylines(dataArray) {
            if (!service.overlays[google.maps.drawing.OverlayType.POLYLINE]) service.overlays[google.maps.drawing.OverlayType.POLYLINE] = [];

            dataArray.forEach(function (item) {
                service.overlays[google.maps.drawing.OverlayType.POLYLINE].push(
                    layerGmapServices.createPolyline(item.path, {
                        strokeColor: item.strokeColor,
                        strokeOpacity: item.strokeOpacity,
                        strokeWeight: item.strokeWeight
                    })
                );
            });
        }

        function loadCircles(dataArray) {
            if (!service.overlays[google.maps.drawing.OverlayType.CIRCLE]) service.overlays[google.maps.drawing.OverlayType.CIRCLE] = [];

            dataArray.forEach(function (item) {
                service.overlays[google.maps.drawing.OverlayType.CIRCLE].push(
                    layerGmapServices.createCircle(item.center, item.radius, {
                        fillColor: item.fillColor,
                        fillOpacity: item.fillOpacity,
                        strokeColor: item.strokeColor,
                        strokeOpacity: item.strokeOpacity,
                        strokeWeight: item.strokeWeight
                    })
                );
            });
        }

        function loadPolygons(dataArray) {
            if (!service.overlays[google.maps.drawing.OverlayType.POLYGON]) service.overlays[google.maps.drawing.OverlayType.POLYGON] = [];

            dataArray.forEach(function (item) {
                service.overlays[google.maps.drawing.OverlayType.POLYGON].push(
                    layerGmapServices.createPolygon(item.path, {
                        fillColor: item.fillColor,
                        fillOpacity: item.fillOpacity,
                        strokeColor: item.strokeColor,
                        strokeOpacity: item.strokeOpacity,
                        strokeWeight: item.strokeWeight
                    })
                );
            });
        }

        function loadRectangles(dataArray) {
            if (!service.overlays[google.maps.drawing.OverlayType.RECTANGLE]) service.overlays[google.maps.drawing.OverlayType.RECTANGLE] = [];

            dataArray.forEach(function (item) {
                service.overlays[google.maps.drawing.OverlayType.RECTANGLE].push(
                    layerGmapServices.createRectangle(item.bounds, {
                        fillColor: item.fillColor,
                        fillOpacity: item.fillOpacity,
                        strokeColor: item.strokeColor,
                        strokeOpacity: item.strokeOpacity,
                        strokeWeight: item.strokeWeight
                    })
                );
            });
        }

        function loadInfoWindows(dataArray) {
            if (!service.overlays['infowindow']) service.overlays['infowindow'] = [];

            dataArray.forEach(function (item) {
                infoWindowServices.addInfoWindow(item.position, item.content);
            });
        }

        return service;
    }
}());