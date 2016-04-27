(function(){
'use strict';

angular.module('demoApp')
    .controller('indexController', ['$scope', '$rootScope', '$mdSidenav', 'routePlannerService', 'rfpLayerServices', indexController]);

    function indexController ($scope, $rootScope, $mdSidenav, routePlannerService, rfpLayerServices) {
        var vm = this;

        // Show Treasure Overlay Spinner
        $rootScope.spinner = {
            active: false
        };

        vm.lastSideNavOpenId = '';

        vm.initialize = initialize;
        vm.toggleLayerPanel = buildToggler('layerPanel');
        vm.toggleRoutePanel = toggleRoutePanel;
        vm.toggleRfpPanel = buildToggler('rfpLayersPanel');
        vm.closeSideNav = closeSideNav;

        vm.initialize();

        function initialize () {
            rfpLayerServices.loadLayers();

            $scope.$on('routePanel-closed', function() {
                routePlannerService.endService();
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