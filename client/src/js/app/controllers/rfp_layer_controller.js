(function () {
    'use strict';

    angular.module('demoApp')
    .controller('rfpLayerController', ['rfpLayerServices', 'alertServices', rfpLayerController]);

    function rfpLayerController (rfpLayerServices, alertServices) {
        var vm = this;

        vm.layers = [];

        vm.initialize = initialize;
        vm.uploadLayerFile = uploadLayerFile;
        vm.showLayer = showLayer;
        vm.deleteLayer = deleteLayer;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {
            vm.layers = rfpLayerServices.layers;
        }

        function uploadLayerFile (file, errorFiles) {
            if (file) {
                rfpLayerServices.addLayer(file)
                    .then(function(layer){
                        // prevent from double adding layer in array
                        //vm.layers.push(layer);
                    });
            } else {
                var errFile = errorFiles && errorFiles[0];
                if(errFile) alertServices.showInvalidFileUpload();
            }
        }

        function showLayer (layer, event) {
            rfpLayerServices.showLayer(layer, event);
        }

        function deleteLayer (layer, index) {
            rfpLayerServices.deleteLayer(layer)
                .then(function(){
                    vm.layers.splice(index, 1);
                });
        }
    }

}());
