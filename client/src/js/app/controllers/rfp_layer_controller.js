(function () {
    'use strict';

    angular.module('demoApp')
    .controller('rfpLayerController', ['rfpLayerServices', 'uploadServices', 'alertServices', rfpLayerController]);

    function rfpLayerController (rfpLayerServices, uploadServices, alertServices) {
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
                uploadServices.uploadLayerFile(file)
                    .then(function (response) {
                        console.log('successfully uploaded layer file: ', response);
                    }, function (errorResponse) {
                        console.log('error uploading layer file: ', errorResponse);
                    });
            } else {
                var errFile = errorFiles && errorFiles[0];
                console.log('error uploading layer file: ', errFile);
                alertServices.showInvalidFileUpload();
            }
        }

        function showLayer (id) {
            rfpLayerServices.loadLayerById(id);
        }

        function deleteLayer (id) {
            console.log('delete layer');
        }
    }

}());
