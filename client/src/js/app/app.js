(function () {
    'use strict';

    angular
        .module('demoApp', ['ngMaterial', 'ngAnimate', 'oitozero.ngSweetAlert', 'treasure-overlay-spinner', 'vAccordion'])

        .constant('APP_NAME', 'Lile International')
        .constant('BASE_URL', window.location.origin)
        .constant('DEST_MARKER_BASE_PATH', '/resources/images/markers/destination/')
        //number_0.png

        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('red')
                .accentPalette('pink');
        });

}());

