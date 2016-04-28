(function(){
'use strict';

angular.module('demoApp')
    .factory('LayerFile', ['Restangular', 'Upload', LayerFile]);

    function LayerFile (Restangular, Upload) {
        var myModel = Restangular.all('layer_files');

        var resource =  {
            upload: function (_file) {
                return Upload.upload({
                    url: myModel.getRestangularUrl(),
                    method: 'POST',
                    data: {file: _file}
                });
            },
            cast: function (layer) {
                return Restangular.restangularizeElement(null, layer, 'layer_files');
            }
        };

        angular.merge(myModel, resource);

        return myModel;
    }

}());
