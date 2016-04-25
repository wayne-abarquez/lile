(function () {
    'use strict';

    angular.module('demoApp')
        .controller('layerController', ['$rootScope', 'truckServices', layerController]);

    function layerController($rootScope, truckServices) {
        var vm = this;

        vm.layers = [
            {
                label: 'Zones',
                action: '',
                selected: false,
                children: [
                    {
                        label: 'Zone 1',
                        selected: false,
                        action: 'layerCtl.toggleZones("1")'
                    },
                    {
                        label: 'Zone 2',
                        selected: false,
                        action: 'layerCtl.toggleZones("2")'
                    },
                    {
                        label: 'Zone 3',
                        selected: false,
                        action: 'layerCtl.toggleZones("3")'
                    },
                    {
                        label: 'Zone 4',
                        selected: false,
                        action: 'layerCtl.toggleZones("4")'
                    },
                    {
                        label: 'Zone 5',
                        selected: false,
                        action: 'layerCtl.toggleZones("5")'
                    },
                    {
                        label: 'Zone 6',
                        selected: false,
                        action: 'layerCtl.toggleZones("6")'
                    }
                ]
            },
            {
                label: 'Trucks',
                action: 'layerCtl.toggleTrucks()',
                selected: false
            },
        ];

        vm.toggleZones = toggleZones;
        vm.toggleTrucks = toggleTrucks;

        function toggleZones (_zoneNumber) {
            $rootScope.$broadcast('toggle-zone-layer', {zoneNumber: _zoneNumber});
        }

        function toggleTrucks () {
            truckServices.toggleTrucks();
        }

    }
}());