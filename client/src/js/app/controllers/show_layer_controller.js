(function(){
'use strict';

angular.module('demoApp')
    .controller('showLayerController', ['$rootScope', '$scope', 'modalServices', 'layer', 'layerGmapServices', '$timeout', 'drawingServices', showLayerController]);

    function showLayerController ($rootScope, $scope, modalServices, layer, layerGmapServices, $timeout, drawingServices) {
        var vm = this;

        vm.layer = layer;

        var map;
        var kmlLayer = null;

        /* DRAWING TOOLS VARS */

        // Save Drawing Button
        $rootScope.showSaveDrawingBtn = false;
        $rootScope.showDeleteSelectedShapeBtn = false;
        $rootScope.showCancelDrawingBtn = false;

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
        vm.editLayer = editLayer;
        vm.updateMap = updateMap;
        vm.close = close;

        vm.actions = [
            {name: "Edit Layer Name", icon: "edit_mode", action: vm.editLayer},
            {name: "Add/Edit Map Annotations", icon: "rate_review", action: vm.updateMap}
        ];

        vm.initialize();

        function loadLayer() {
            if (kmlLayer && kmlLayer.getMap()) {
                kmlLayer.setMap(null);
            }

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
            }, function (newValue, oldValue) {
                //if(newValue === oldValue) return;
                //console.log('screenshot shape stroke color is changed: ' + newVal);
                $rootScope.shapeStrokeColor = newValue;
            });

            $scope.$watch(function () {
                return vm.shapeFillColor;
            }, function (newValue, oldValue) {
                //if (newValue === oldValue) return;
                //console.log('screenshot shape fill color is changed: ' + newVal);
                $rootScope.shapeFillColor = newValue;
            });

            $scope.$watch(function () {
                return vm.shapeStrokeWidth;
            }, function (newValue, oldValue) {
                //if (newValue === oldValue) return;
                //console.log('screenshot shape stroke color is changed: ' + newVal);
                $rootScope.shapeStrokeWidth = newValue;
            });
        }

        function initialize () {
            console.log('vm.layer: ',vm.layer);

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

            }, 100);

            $scope.$on('$destroy', function () {
                layerGmapServices.destroyMap();
            });
        }

        function editLayer () {
            console.log('edit layer');
        }

        function updateMap () {
            drawingServices.initialize();
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
            console.log('save drawing');
        }

        function deleteSelectedShape () {
            console.log('delete selected shape');
        }

        function cancelDrawing () {
            console.log('cancel drawing');
        }

        function addTextBubble () {
            $rootScope.$broadcast('add-screenshot-text-bubble');
        }

        function showStrokeWidthOptions () {
            vm.showStrokeWidth = !vm.showStrokeWidth;
        }

        function stopDrawing(){
            console.log('stop drawing');
        }


    }
}());