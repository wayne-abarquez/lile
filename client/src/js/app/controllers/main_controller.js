(function(){
'use strict';

angular.module('demoApp')
    .controller('mainController', ['APP_NAME', '$rootScope', '$mdSidenav', mainController]);

    function mainController (APP_NAME, $rootScope, $mdSidenav) {
        var vm = this;

        $rootScope.APP_NAME = APP_NAME;

        /* Side Nav Menus */
        vm.menu = [
            {
                link: '/',
                title: 'Home',
                icon: 'home'
            },
            //{
            //    link: '/admin',
            //    title: 'Admin',
            //    icon: 'contacts'
            //},
            {
                link: '/logout',
                title: 'Logout',
                icon: 'exit_to_app'
            }
        ];

        vm.toggleMainMenu = buildToggler('mainMenuSidenav');

        /* Non Scope Functions here */
        function buildToggler(navID) {
            return function () {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        console.log("toggle " + navID + " is done");
                    });
            }
        }

    }
}());