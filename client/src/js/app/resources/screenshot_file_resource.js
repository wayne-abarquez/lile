(function(){
'use strict';

angular.module('demoApp')
    .factory('ScreenshotFile', ['Restangular', 'Upload', ScreenshotFile]);

    function ScreenshotFile (Restangular, Upload) {
        var myModel = Restangular.all('screenshots');
        var modelUrl = myModel.getRestangularUrl();

        var resource = {
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
