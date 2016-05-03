(function(){
'use strict';

angular.module('demoApp')
    .factory('uploadServices', ['$q', 'LayerFile', 'ScreenshotFile', uploadServices]);

    function uploadServices ($q, LayerFile, ScreenshotFile) {
        var service = {};

        service.uploadLayerFile = uploadLayerFile;
        service.uploadBulkAddress = uploadBulkAddress;
        service.parseScreenshotPhoto = parseScreenshotPhoto;
        service.uploadScreenshot = uploadScreenshot;

        function uploadLayerFile (file) {
            var dfd = $q.defer();

            if(!file) {
                dfd.reject();
                return dfd.promise;
            }

            LayerFile.upload(file)
                .then(function(response){
                    dfd.resolve(response);
                }, function(errorResponse){
                    dfd.reject(errorResponse);
                });

            return dfd.promise;
        }

        function uploadBulkAddress (file) {
            var dfd = $q.defer();

            if (!file) {
                dfd.reject();
                return dfd.promise;
            };

            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');

            reader.onload = function (evt) {
                var contents = evt.target.result;
                var addressArray = contents.split("\n");
                dfd.resolve(addressArray);
            };

            reader.onerror = function (evt) {
                dfd.reject(evt);
            };

            return dfd.promise;
        }

        function parseScreenshotPhoto(blob) {
            var file = null;

            var date = new Date();
            var dateString = date.getTime();
            var filename = "screenshot-" + dateString + ".png";

            try {
                file = new File([blob], filename, {type: blob.type});
            } catch (err) {
                file = blob;
                file.name = filename;
                file.type = blob.type;
            }
            return file;
        }

        function uploadScreenshot(blob) {
            var dfd = $q.defer();

            if (!blob) {
                dfd.reject();
                return dfd.promise;
            }

            var file = service.parseScreenshotPhoto(blob);

            ScreenshotFile.upload(file)
                .then(function (response) {
                    dfd.resolve(response);
                }, function (errorResponse) {
                    dfd.reject(errorResponse);
                });

            return dfd.promise;
        }

        return service;
    }
}());