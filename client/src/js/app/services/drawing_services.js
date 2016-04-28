(function(){
'use strict';

angular.module('demoApp')
    .factory('drawingServices', ['$rootScope', '$timeout', 'layerGmapServices', 'gmapServices', 'infoWindowServices', 'utilServices', drawingServices]);

    function drawingServices ($rootScope, $timeout, layerGmapServices, gmapServices, infoWindowServices, utilServices) {
        var service = {};


        var shapes = [],
            selectedShape = null,
            lineWidth = 1.0
        ;

        var drawingManager = null,
            drawingCompleteListener = null,
            screenshotCancelledListener = null,
            mapClickListener = null;
        ;

        $rootScope.hasScreenshotSelectedShape = false;
        $rootScope.showDrawingToolButtons = false;

        var drawingListeners = {
            'deleteSelectedListener': null,
            'addTextBubbleListener': null,
            'startScreenshotListener': null
        };

        service.initialize = initialize;
        service.endDrawing = endDrawing;

        function showScreenshotTools() {
            // Show Map Cancel button
            $rootScope.showDrawingToolButtons = true;
        }

        function hideScreenshotTools() {
            if (drawingManager) {
                gmapServices.hideDrawingManager(drawingManager);
                drawingManager = null;
            }

            if (drawingCompleteListener) {
                gmapServices.removeListener(drawingCompleteListener);
                drawingCompleteListener = null;
            }

            cancelAddTextBubble();

            $rootScope.showDrawingToolButtons = false;
            $rootScope.showStrokeWidth = false;
        }

        function selectShape(shape) {
            if (selectedShape) {
                console.log('selectShape: ',selectedShape);

                selectedShape.shape.setDraggable(false);

                if (selectedShape.type != google.maps.drawing.OverlayType.MARKER)
                    selectedShape.shape.setEditable(false);
            }

            var _shape = shape;

            $timeout(function () {
                selectedShape = _shape;
                if (selectedShape && selectedShape.shape) {
                    selectedShape.shape.setDraggable(true);

                    if (selectedShape.type != google.maps.drawing.OverlayType.MARKER) selectedShape.shape.setEditable(true);

                    $rootScope.hasScreenshotSelectedShape = true;
                }
            });
        }

        function deleteShapeAtIndex(index) {
            if (index >= 0) {
                var object = shapes[index];
                shapes.splice(index, 1);
                gmapServices.removeListener(object.listener);
                gmapServices.hidePolygon(object.shape);
                delete object.shape;
                delete object.listener;
                selectedShape = null;
                selectLastShape();
            }
        }

        function onClickShape() {
            var index = _.findIndex(shapes, {shape: this})
            if (index >= 0) selectShape(shapes[index]);
        }

        function selectLastShape() {
            if (shapes.length > 0) selectShape(shapes[shapes.length - 1]);
            else selectShape(null);
        }

        function deleteSelected() {
            if (selectedShape) {
                deleteShapeAtIndex(_.indexOf(shapes, selectedShape));
                if (shapes.length <= 0) $rootScope.hasScreenshotSelectedShape = false;
            }
        }

        function updateSelectedShape() {
            if (!selectedShape) return;

            if (selectedShape.type == google.maps.drawing.OverlayType.MARKER) {
                console.log('no opts for marker');
            } else if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
                selectedShape.shape.setOptions(colorOpts.polyline);
            } else if (selectedShape.type == google.maps.drawing.OverlayType.CIRCLE) {
                selectedShape.shape.setOptions(colorOpts.circle);
            } else if (selectedShape.type == google.maps.drawing.OverlayType.POLYGON) {
                selectedShape.shape.setOptions(colorOpts.polygon);
            } else if (selectedShape.type == google.maps.drawing.OverlayType.RECTANGLE) {
                selectedShape.shape.setOptions(colorOpts.rectangle);
            }
        }

        function cancelAddTextBubble() {
            if (mapClickListener) {
                layerGmapServices.setMapCursorDefault();
                gmapServices.removeListener(mapClickListener);
                mapClickListener = null;
            }
        }

        function addTextBubble() {
            if (!mapClickListener) {
                mapClickListener = layerGmapServices.addMapListener('click', function (e) {
                    infoWindowServices.addInfoWindow(e.latLng);
                    cancelAddTextBubble();
                });
                layerGmapServices.setMapCursorCrosshair();
            }

            if (drawingManager) {
                var setDragTool = {drawingMode: null};
                drawingManager.setOptions(setDragTool);
            }
        }

        /* Color Picker Functions */

        var colorOpts = {
          circle: null,
          polygon: null,
          polyline: null,
          rectangle: null
        };

        function setDrawingOption(optionName, propertyNames, values) {
            if (drawingManager) {
                var options = drawingManager.get(optionName);
                if (options) {
                    for (var i = 0; i < propertyNames.length && i < values.length; i++) {
                        var propertyName = propertyNames[i];
                        var value = values[i];
                        if (options.hasOwnProperty(propertyName)) {
                            options[propertyName] = value;
                        }
                    }
                    drawingManager.set(optionName, options);
                    return options;
                }
            }
            return null;
        }

        function changeColor (color, arrayParams) {
            var rgba = /rgba\(([0-9\.]+),([0-9\.]+),([0-9\.]+),([0-9\.]+)\)/.exec(color);
            var colorHexString = '#'
                    + utilServices.byteToHex(parseFloat(rgba[1]))
                    + utilServices.byteToHex(parseFloat(rgba[2]))
                    + utilServices.byteToHex(parseFloat(rgba[3]))
                ;

            for(var shape in colorOpts) {
                colorOpts[shape] = setDrawingOption( shape + 'Options', arrayParams, [colorHexString, parseFloat(rgba[4])]);
            }

            updateSelectedShape();
        }

        function onChangeStrokeColor() {
            var color = $rootScope.shapeStrokeColor;
            if (!color) return;

            var rgba = /rgba\(([0-9\.]+),([0-9\.]+),([0-9\.]+),([0-9\.]+)\)/.exec(color);
            var colorHexString = '#'
                + utilServices.byteToHex(parseFloat(rgba[1]))
                + utilServices.byteToHex(parseFloat(rgba[2]))
                + utilServices.byteToHex(parseFloat(rgba[3]))
            ;

            colorOpts.circle = setDrawingOption('circleOptions', ['strokeColor', 'strokeOpacity'], [colorHexString, parseFloat(rgba[4])]);
            colorOpts.polygon = setDrawingOption('polygonOptions', ['strokeColor', 'strokeOpacity'], [colorHexString, parseFloat(rgba[4])]);
            colorOpts.polyline = setDrawingOption('polylineOptions', ['strokeColor', 'strokeOpacity'], [colorHexString, parseFloat(rgba[4])]);
            colorOpts.rectangle = setDrawingOption('rectangleOptions', ['strokeColor', 'strokeOpacity'], [colorHexString, parseFloat(rgba[4])]);

            updateSelectedShape();
        }

        function onChangeFillColor() {
            var color = $rootScope.shapeFillColor;
            if (!color) return;

            var rgba = /rgba\(([0-9\.]+),([0-9\.]+),([0-9\.]+),([0-9\.]+)\)/.exec(color);
            var colorHexString = '#'
                + utilServices.byteToHex(parseFloat(rgba[1]))
                + utilServices.byteToHex(parseFloat(rgba[2]))
                + utilServices.byteToHex(parseFloat(rgba[3]))
            ;

            colorOpts.circle = setDrawingOption('circleOptions', ['fillColor', 'fillOpacity'], [colorHexString, parseFloat(rgba[4])]);
            colorOpts.polygon = setDrawingOption('polygonOptions', ['fillColor', 'fillOpacity'], [colorHexString, parseFloat(rgba[4])]);
            colorOpts.polyline = setDrawingOption('polylineOptions', ['fillColor', 'fillOpacity'], [colorHexString, parseFloat(rgba[4])]);
            colorOpts.rectangle = setDrawingOption('rectangleOptions', ['fillColor', 'fillOpacity'], [colorHexString, parseFloat(rgba[4])]);

            updateSelectedShape();
        }

        function onChangeStrokeWidth() {
            $timeout(function () {
                var _lineWidth = $rootScope.shapeStrokeWidth;

                lineWidth = _lineWidth;

                colorOpts.circle = setDrawingOption('circleOptions', ['strokeWeight'], [lineWidth]);
                colorOpts.polygon = setDrawingOption('polygonOptions', ['strokeWeight'], [lineWidth]);
                colorOpts.polyline = setDrawingOption('polylineOptions', ['strokeWeight'], [lineWidth]);
                colorOpts.rectangle = setDrawingOption('rectangleOptions', ['strokeWeight'], [lineWidth]);

                updateSelectedShape();
            });
        }

        /* End Color Picker Functions */

        function overlayCompleteListener(eventArgs) {
            var object = {
                shape: eventArgs.overlay,
                type: eventArgs.type,
                listener: gmapServices.addListener(
                    eventArgs.overlay, 'click', onClickShape
                )
            };
            shapes.push(object);
            selectLastShape();
        }

        function destroyListeners() {
            for (var key in drawingListeners) {
                if (drawingListeners.hasOwnProperty(key)) {
                    if (drawingListeners[key]) {
                        drawingListeners[key]();
                        drawingListeners[key] = null;
                    }
                }
            }
        }

        function destroyDrawingManager() {
            if (drawingManager) {
                gmapServices.hideDrawingManager(drawingManager);
                drawingManager = null;
            }

            if (drawingCompleteListener) {
                gmapServices.removeListener(drawingCompleteListener);
                drawingCompleteListener = null;
            }

            if (screenshotCancelledListener) {
                screenshotCancelledListener();
                screenshotCancelledListener = null;
            }

            destroyListeners();
        }

        function initScreenshotListeners() {
            if (!screenshotCancelledListener) screenshotCancelledListener = $rootScope.$on('screenshot-cancelled', service.endDrawing);
        }

        function initDrawingListener() {
            if (gmapServices.apiAvailable()) {
                if (!drawingCompleteListener) drawingCompleteListener = gmapServices.addListener(
                        drawingManager, 'overlaycomplete', overlayCompleteListener);

                $timeout(function () {
                    showScreenshotTools();
                });
            }
        }

        function initDrawingManager() {
            if (service.drawingManager) {
                // Reinitialize Drawing Listener
                initDrawingListener();
                return;
            }

            drawingManager = gmapServices.createDrawingToolsManager();
            layerGmapServices.showDrawingManager(drawingManager);

            initDrawingListener();
            initScreenshotListeners();
        }

        function watchShapeAtrributesValue() {
            $rootScope.$watch('shapeStrokeColor', onChangeStrokeColor);

            $rootScope.$watch('shapeFillColor', onChangeFillColor);

            $rootScope.$watch('shapeStrokeWidth', onChangeStrokeWidth);

            drawingListeners.deleteSelectedListener = $rootScope.$on('delete-selected', deleteSelected);

            drawingListeners.addTextBubbleListener = $rootScope.$on('add-screenshot-text-bubble', addTextBubble);
        }

        function endDrawing() {
            while (shapes.length > 0) deleteShapeAtIndex(shapes.length - 1);

            infoWindowServices.clearInfoWindows();
            hideScreenshotTools();
            destroyDrawingManager();

            console.log('endDrawing is called');
        }

        function initialize () {
            initDrawingManager();
            watchShapeAtrributesValue();
            //$(document).keyup(cancelScreenshotOnEsc);
        }

        return service;
    }
}());