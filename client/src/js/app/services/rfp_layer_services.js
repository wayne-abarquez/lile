(function(){
'use strict';

angular.module('demoApp')
    .factory('rfpLayerServices', ['LayerFile', 'gmapServices', rfpLayerServices]);

    function rfpLayerServices (LayerFile, gmapServices) {
        var service = {};

        service.layers = [];
        service.loadedKmlLayer = null;

        service.loadLayers = loadLayers;
        service.loadLayerById = loadLayerById;

        function loadLayers () {
            LayerFile.getList()
                .then(function(layers){
                    layers.forEach(function(layer){
                        var fileArray = layer.file_path.split('/');
                        layer.filename = fileArray[fileArray.length - 1];
                        service.layers.push(layer);
                    });
                }, function(err){console.log('err');});
        }

        function loadLayerById (id) {
            if(service.loadedKmlLayer && service.loadedKmlLayer.getMap()) {
                service.loadedKmlLayer.setMap(null);
            }

            var layer = _.findWhere(service.layers, {id: id});

            if(layer) {
                if(service.loadedKmlLayer) {
                    service.loadedKmlLayer.setUrl(layer.src);
                    return;
                }

                service.loadedKmlLayer = gmapServices.loadKMLByURL(layer.src);
                console.log('service.loadedKmlLayer: ', service.loadedKmlLayer);
            }
        }

        return service;
    }
}());