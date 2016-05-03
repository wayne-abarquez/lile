(function(){
'use strict';

angular.module('demoApp')
    .controller('showLayerController', ['$rootScope', '$scope', 'modalServices', 'layer', 'layerGmapServices', '$timeout', 'drawingServices', 'layerOverlayServices', 'screenshotServices', showLayerController]);

    function showLayerController ($rootScope, $scope, modalServices, layer, layerGmapServices, $timeout, drawingServices, layerOverlayServices, screenshotServices) {
        var vm = this;

        vm.layer = layer;
        vm.overlay_copy = angular.copy(vm.layer.overlay);

        var map;
        var kmlLayer = null;

        /* DRAWING TOOLS VARS */

        // Save Drawing Button
        $rootScope.showSaveDrawingBtn = false;
        $rootScope.showDeleteSelectedShapeBtn = false;
        $rootScope.showCancelDrawingBtn = false;

        vm.hasSelectedShape = false;

        $rootScope.shapeFillColor = '';
        $rootScope.shapeStrokeColor = '';

        vm.showStrokeWidth = false;

        // Drawing Tool Buttons
        vm.showDrawingToolButtons = false;

        /* DRAWING TOOLS FUNCTIONS */

        vm.saveDrawing = saveDrawing;
        vm.deleteSelectedShape = deleteSelectedShape;
        vm.cancelDrawing = cancelDrawing;

        vm.addTextBubble = addTextBubble;
        vm.showStrokeWidthOptions = showStrokeWidthOptions;
        vm.stopDrawing = stopDrawing;

        /* END OF DRAWING TOOLS */

        vm.initialize = initialize;
        vm.updateMap = updateMap;
        vm.updateLayerName = updateLayerName;
        vm.initilaizePDFExporting = initilaizePDFExporting;
        vm.close = close;

        vm.actions = [
            {name: "Edit Layer Name", icon: "edit_mode", action: vm.editLayer},
            {name: "Add/Edit Map Annotations", icon: "rate_review", action: vm.updateMap}
        ];

        vm.initialize();

        function loadLayer() {
            if (kmlLayer && kmlLayer.getMap())  kmlLayer.setMap(null);

            if (kmlLayer) {
                kmlLayer.setUrl(layer.src);
                return;
            }

            kmlLayer = layerGmapServices.loadKMLByURL(layer.src);
        }

        /* Controller Functions here */
        function loadMap(mapId) {
            map = layerGmapServices.createMap(mapId);
            loadLayer();
        }

        function watchDrawingModels() {
            $scope.$watch(function () {
                return vm.shapeStrokeColor;
            }, function (newValue) {
                $rootScope.shapeStrokeColor = newValue;
            });

            $scope.$watch(function () {
                return vm.shapeFillColor;
            }, function (newValue) {
                $rootScope.shapeFillColor = newValue;
            });

            $scope.$watch(function () {
                return vm.shapeStrokeWidth;
            }, function (newValue) {
                $rootScope.shapeStrokeWidth = newValue;
            });
        }

        function loadOverlay (overlayArray) {
            if(!overlayArray.length) return;

            // get the first overlay
            var overlay = overlayArray[0];
            var overlayData = JSON.parse(overlay.json_content);

            layerOverlayServices.loadOverlay(overlayData);
        }

        function initialize () {
            //console.log('vm.layer: ',vm.layer);
            //console.log('overlay copy: ', vm.overlay_copy);

            $timeout(function(){
                loadMap('layer-map');

                watchDrawingModels();

                $rootScope.$watch('showStrokeWidth', function (newValue, oldValue) {
                    if (newValue === oldValue) return;
                    vm.showStrokeWidth = newValue;
                });

                $rootScope.$watch('showDrawingToolButtons', function (newValue, oldValue) {
                    if (newValue === oldValue) return;
                    vm.showDrawingToolButtons = newValue;
                });

                $rootScope.$watch('hasScreenshotSelectedShape', function (newValue, oldValue) {
                    if (newValue === oldValue) return;
                    vm.hasSelectedShape = newValue;
                });

                loadOverlay(vm.overlay_copy);

                screenshotServices.initialize();

            }, 100);

            $scope.$on('$destroy', function () {
                screenshotServices.endService();
                layerOverlayServices.destroyOverlays();
                layerGmapServices.destroyMap();
            });
        }

        function updateLayerName (layerName) {
            var origLayerName = angular.copy(vm.layer.layer_name);
            vm.layer.layer_name = layerName;
            vm.layer.put()
                .then(function(response){
                    console.log('success updating layername : ', response);
                },function(err){
                    console.log('error updating layername');
                    vm.layer.layer_name = origLayerName;
                });
        }

        function updateMap () {
            drawingServices.initialize(layerOverlayServices.overlays);
        }

        function initilaizePDFExporting () {
            $rootScope.$broadcast('start-screenshot', {mapId: 'layer-map'});
        }

        function close () {
            modalServices.closeModal();
        }


        /* DRAWING TOOLS FUNCTIONS */

        vm.saveDrawing = saveDrawing;
        vm.deleteSelectedShape = deleteSelectedShape;
        vm.cancelDrawing = cancelDrawing;

        vm.addTextBubble = addTextBubble;
        vm.showStrokeWidthOptions = showStrokeWidthOptions;
        vm.stopDrawing = stopDrawing;

        function saveDrawing () {
            var data = drawingServices.getDrawingData(),
                promise = null;

            // update overlay
            if(vm.layer.overlay.length && vm.layer.overlay[0].json_content) {
                promise = vm.layer.customPUT(data, 'layer_overlays');
            } else {
                // create new overlay
                // save to db json data
                // dismiss drawing tools
                promise = vm.layer.customPOST(data, 'layer_overlays');
            }

            promise
                .then(function(response){
                    vm.layer.overlay = response.layer_file.overlay;
                    vm.overlay_copy = angular.copy(vm.layer.overlay);
                    // load from layer overlay service
                    loadOverlay(vm.overlay_copy);
                }, function (error) {
                    console.log('error : ', error);
                });

            promise
                .finally(function () {
                    drawingServices.endDrawing();
                    layerOverlayServices.showOverlay();
                });
        }

        function deleteSelectedShape () {
            $rootScope.$broadcast('delete-selected');
        }

        function cancelDrawing () {
            $rootScope.$broadcast('cancel-drawing');
        }

        function addTextBubble () {
            $rootScope.$broadcast('add-screenshot-text-bubble');
        }

        function showStrokeWidthOptions () {
            vm.showStrokeWidth = !vm.showStrokeWidth;
        }

        function stopDrawing(){
            $rootScope.$broadcast('screenshot-cancelled');
            layerOverlayServices.destroyOverlays();
            vm.layer.overlay = vm.overlay_copy;
            loadOverlay(vm.layer.overlay);
        }


    }
}());