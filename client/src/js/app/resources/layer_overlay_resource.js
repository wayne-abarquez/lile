(function () {
    'use strict';

    angular.module('demoApp')
        .factory('LayerOverlay', ['Restangular', LayerOverlay]);

    function LayerOverlay(Restangular) {
        var myModel = Restangular.all('layer_overlays');

        var resource = {
            cast: function (layer) {
                return Restangular.restangularizeElement(null, layer, 'layer_overlays');
            }
        };

        angular.merge(myModel, resource);

        return myModel;
    }

}());
