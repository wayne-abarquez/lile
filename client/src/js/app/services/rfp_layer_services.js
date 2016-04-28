(function(){
'use strict';

angular.module('demoApp')
    .factory('rfpLayerServices', ['$q', 'LayerFile', 'uploadServices', 'gmapServices', 'modalServices', rfpLayerServices]);

    function rfpLayerServices ($q, LayerFile, uploadServices, gmapServices, modalServices) {
        var service = {};

        service.layers = [];

        service.loadLayers = loadLayers;
        service.addLayer = addLayer;
        service.showLayer = showLayer;
        service.findLayerById = findLayerById;
        service.findLayerIndexById = findLayerIndexById;
        service.deleteLayer = deleteLayer;

        function getFilename (file_path) {
            var fileArray = file_path.split('/');
            return fileArray[fileArray.length - 1];
        }

        function loadLayers () {
            LayerFile.getList()
                .then(function(layers){
                    layers.forEach(function(layer){
                        layer.filename = getFilename(layer.file_path);
                        service.layers.push(layer);
                    });
                });
        }

        function addLayer (file) {
            var dfd = $q.defer();

            uploadServices.uploadLayerFile(file)
                .then(function (response) {
                    var layer = response.data.layer_file;
                    layer.filename = getFilename(layer.file_path);
                    var restangularizedFile = LayerFile.cast(layer);
                    service.layers.push(restangularizedFile);

                    dfd.resolve(restangularizedFile);
                }, function(error) { dfd.reject(error); });

            return dfd.promise;
        }

        function showLayer (layer, event) {
            return modalServices.showLayer(layer, event);
        }

        function findLayerById (id) {
            return _.findWhere(service.layers, {id: id});
        }

        function findLayerIndexById(id) {
            var index = _.findIndex(service.layers, function (layer) {
                return layer.id = id;
            });

            return index !== -1 ? index : false;
        }

        function deleteLayer (layer) {
            var dfd = $q.defer();

            layer.remove()
                .then(function(response){
                    var index = service.findLayerIndexById(layer.id);
                    if(index) service.layers.splice(index, 1);
                    dfd.resolve(response);
                },function(error){
                    dfd.reject(error);
                });

            return dfd.promise;
        }

        return service;
    }
}());