(function () {
    'use strict';

    angular.module('demoApp')
    .controller('rfpLayerController', ['uploadServices', 'alertServices', rfpLayerController]);

    function rfpLayerController (uploadServices, alertServices) {
        var vm = this;

        vm.initialize = initialize;
        vm.uploadLayerFile = uploadLayerFile;

        vm.initialize();

        /* Controller Functions here */

        function initialize () {}

        function uploadLayerFile (file, errorFiles) {
            if (file) {
                uploadServices.uploadLayerFile(file)
                    .then(function (response) {
                        console.log('successfully uploaded layer file');
                    }, function (errorResponse) {
                        console.log('error uploading layer file: ', errorResponse);
                    });
            } else {
                var errFile = errorFiles && errorFiles[0];
                console.log('error uploading layer file: ', errFile);
                alertServices.showInvalidFileUpload();
            }
        }
    }

}());
