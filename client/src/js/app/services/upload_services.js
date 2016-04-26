(function(){
'use strict';

angular.module('demoApp')
    .factory('uploadServices', ['$q', 'LayerFile', uploadServices]);

    function uploadServices ($q, LayerFile) {
        var service = {};

        service.uploadLayerFile = uploadLayerFile;

        function uploadLayerFile (file) {
            var dfd = $q.defer();

            console.log('upload layer file: ', file);

            // show loading animation

            if(!file) dfd.reject();

            LayerFile.upload(file)
                .then(function(response){
                    dfd.resolve(response);
                }, function(errorResponse){
                    dfd.reject(errorResponse);
                })
                .finally(function(){
                    // hide loading animation
                });

            return dfd.promise;
        }

        return service;
    }
}());