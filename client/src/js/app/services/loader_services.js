(function(){
'use strict';

angular.module('demoApp')
    .factory('loaderServices', ['$rootScope', loaderServices]);

    function loaderServices ($rootScope) {
        var service = {};

        service.showLoader = showLoader;
        service.hideLoader = hideLoader;
        service.toggleModalLoader = toggleModalLoader;

        function showLoader () {
            $rootScope.spinner.active = true;
            console.log('showing loader');
        }

        function hideLoader (_doApply) {
            var doApply = _doApply || false;
            if(doApply) {
                $rootScope.$apply(function () {
                    $rootScope.spinner.active = false;
                });
            } else {
                $rootScope.spinner.active = false;
            }
        }

        function toggleModalLoader () {
           var zIndex = $("#modal-loader").css('zIndex');
           var newZIndex = zIndex > 0 ? 0 : 12;
           $("#modal-loader").css('zIndex', newZIndex);
        }
        

        return service;
    }
}());