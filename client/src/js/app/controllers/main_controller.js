(function(){
'use strict';

angular.module('demoApp')
    .controller('mainController', ['APP_NAME', '$rootScope', mainController]);

    function mainController (APP_NAME, $rootScope) {
        var vm = this;

        $rootScope.APP_NAME = APP_NAME;

    }
}());