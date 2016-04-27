(function(){
'use strict';

angular.module('demoApp')
    .factory('uploadServices', ['$q', 'LayerFile', uploadServices]);

    function uploadServices ($q, LayerFile) {
        var service = {};

        service.uploadLayerFile = uploadLayerFile;
        service.uploadBulkAddress = uploadBulkAddress;

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

        return service;
    }
}());