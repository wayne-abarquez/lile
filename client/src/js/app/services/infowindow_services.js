(function () {
    'use strict';

    angular.module('demoApp')
        .factory('infoWindowServices', ['layerGmapServices', infoWindowServices]);

    function infoWindowServices(layerGmapServices) {
        var service = {};

        var uniqueId = 0;
        var openList = [];
        var closeList = [];

        // TODO Change this to google map infowindow

        service.addInfoWindow = addInfoWindow;
        service.clearInfoWindows = clearInfoWindows;

        function addInfoWindow(position) {
            var infoWindow = layerGmapServices.createCanvasInfoWindow();
            infoWindow.uniqueId = uniqueId++;
            infoWindow.setPosition(position);
            infoWindow.open();
            openList.push(infoWindow);
        }

        function clearInfoWindows() {
            while (openList.length > 0) {
                var infoWindow = openList[openList.length - 1];
                openList.splice(openList.length - 1, 1);
                layerGmapServices.hideCanvasInfoWindow(infoWindow);
                closeList.push(infoWindow);
            }
        }

        return service;
    }
}());