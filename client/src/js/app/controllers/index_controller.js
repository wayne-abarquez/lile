(function(){
'use strict';

angular.module('demoApp')
    .controller('indexController', ['$scope', '$rootScope', '$mdSidenav', 'gmapServices', indexController]);

    function indexController ($scope, $rootScope, $mdSidenav, gmapServices) {
        var vm = this;

        // Show Treasure Overlay Spinner
        $rootScope.spinner = {
            active: false
        };

        vm.lastSideNavOpenId = '';

        vm.initialize = initialize;
        vm.toggleLayerPanel = buildToggler('layerPanel');
        vm.toggleRoutePanel = toggleRoutePanel;
        vm.closeSideNav = closeSideNav;

        vm.initialize();

        function initialize () {
            $scope.$on('routePanel-closed', function() {
              gmapServices.setMapDefaultCursor();
            });
        }

        function buildToggler(navID) {
            return function () {
                if (vm.lastSideNavOpenId && vm.lastSideNavOpenId !== navID) {
                    closeSideNav(vm.lastSideNavOpenId);
                }
                $mdSidenav(navID).toggle();
                vm.lastSideNavOpenId = navID;
            }
        }

        function toggleRoutePanel () {
            var navID = 'routePanel';

            if (vm.lastSideNavOpenId && vm.lastSideNavOpenId !== navID) closeSideNav(vm.lastSideNavOpenId);

            vm.lastSideNavOpenId = navID;

            $mdSidenav(navID).toggle()
                .then(function () {
                    //console.log('route panel toggled');
                    $rootScope.$broadcast('route-panel-opened');
                });
        }

        function closeSideNav(navID) {
            $mdSidenav(navID)
                .close()
                .then(function(){
                    $scope.$broadcast(navID + '-closed');
                })
            ;
        }
    }
}());