(function () {
    'use strict';

    angular
        .module('demoApp', ['restangular', 'ngMaterial', 'ngAnimate', 'oitozero.ngSweetAlert',
            'ngFileUpload', 'treasure-overlay-spinner', 'vAccordion', 'colorpicker.module',
            'angularInlineEdit', 'angularMoment'])

        .constant('APP_NAME', 'Lile International')
        .constant('BASE_URL', window.location.origin)
        .constant('DEST_MARKER_BASE_PATH', '/resources/images/markers/destinations/')

        .config(['RestangularProvider', function (RestangularProvider) {
            //set the base url for api calls on our RESTful services
            var baseUrl = window.location.origin + '/api';
            RestangularProvider.setBaseUrl(baseUrl);
        }])

        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('red')
                .accentPalette('pink');
        });

}());
