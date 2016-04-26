(function(){
'use strict';

angular.module('demoApp')
    .factory('LayerFile', ['Restangular', 'Upload', LayerFile]);

    function LayerFile (Restangular, Upload) {
        var myModel = Restangular.all('layer_files');

        var resource =  {
            upload: function (_file) {
                var uploadUrl = myModel.getRestangularUrl();

                console.log('LayerFile Resource : Upload');

                return Upload.upload({
                    url: uploadUrl,
                    method: 'POST',
                    data: {file: _file}
                });
            }
        };

        angular.merge(myModel, resource);

        return myModel;
    }

}());
