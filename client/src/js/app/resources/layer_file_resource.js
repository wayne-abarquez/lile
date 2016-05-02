(function(){
'use strict';

angular.module('demoApp')
    .factory('LayerFile', ['Restangular', 'Upload', LayerFile]);

    function LayerFile (Restangular, Upload) {
        var myModel = Restangular.all('layer_files');
        var modelUrl = myModel.getRestangularUrl();

        var resource = {
            cast: function (layer) {
                return Restangular.restangularizeElement(null, layer, 'layer_files');
            },
            upload: function (_file) {
                return Upload.upload({
                    url: modelUrl,
                    method: 'POST',
                    data: {file: _file}
                });
            }
        };

        angular.merge(myModel, resource);

        return myModel;
    }

}());
