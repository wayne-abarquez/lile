(function(){
'use strict';

angular.module('demoApp')
    .factory('webServices', ["webRequest", webServices]);

    function webServices(webRequest) {
        var service = {};

        /*
        * Meters
        */
        //service.getMeters = function (zoomLevel) {
        //    return webRequest.get('/api/meters');
        //};
        //
        //service.getMeterClustersByZoom = function (zoomLevel) {
        //    return webRequest.get('/api/meters/clusters/zoom/' + zoomLevel);
        //};
        //
        //service.getMeterClustersByZoomAndBounds = function (zoomLevel, bounds) {
        //    return webRequest.get('/api/meters/clusters/zoom/' + zoomLevel + '/bounds/' + bounds);
        //};
        //
        //service.getMetersWithinBounds = function (bounds) {
        //    return webRequest.get('/api/meters/bounds/' + bounds);
        //};
        //
        //service.getMetersByID = function (id) {
        //    return webRequest.get('/api/meters/' + id);
        //};
        //
        //service.getMetersBounds = function () {
        //  return webRequest.get('/api/meters/get_bounds');
        //};
        //
        //service.getMeterByMeterNo = function (meterNo) {
        //    return webRequest.get('/api/meters/get_by_meter_no/' + meterNo);
        //}

        return service;
    }
}());