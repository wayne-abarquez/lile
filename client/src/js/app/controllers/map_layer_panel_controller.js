(function(){
'use strict';

angular.module('demoApp')
    .controller('mapLayerPanelController', ['$mdSidenav', mapLayerPanelController]);

    function mapLayerPanelController ($mdSidenav) {
        var vm = this;

        vm.layers = [
            {
                label: 'Meters',
                selected: false
            },
            {
                label: 'Primary Circuits',
                selected: false
            },
            {
                label: 'Secondary Circuits',
                selected: false
            },
            {
                label: 'Transformers',
                selected: false
            },
            {
                label: 'Poles',
                selected: false
            },
            {
                label: 'Outages',
                selected: false
            },
            {
                label: 'Imagery',
                selected: false
            }
        ];

        //vm.initialize = initialize;
        //
        //vm.initialize();

        /* Controller Functions here */

        //function initialize () {
        //
        //}


        /* Non Scope Functions here */

    }
}());