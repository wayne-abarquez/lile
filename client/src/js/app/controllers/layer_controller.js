(function () {
    'use strict';

    angular.module('demoApp')
        .controller('layerController', ['$rootScope', layerController]);

    function layerController($rootScope) {
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
            }
        ];

        vm.toggleZones = toggleZones;

        function toggleZones (_zoneNumber) {
            $rootScope.$broadcast('toggle-zone-layer', {zoneNumber: _zoneNumber});
        }

    }
}());