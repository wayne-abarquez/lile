(function () {
    'use strict';

    var truckHQ = [
        {
            id: 1,
            zone_id: 1,
            no_of_trucks: 5,
            location: {lat: 47.671918739454114, lng: -122.36743927001953}
        },
        {
            id: 2,
            zone_id: 2,
            no_of_trucks: 5,
            location: {lat: 47.67983622284604, lng: -122.29491233825684}
        },
        {
            id: 3,
            zone_id: 3,
            no_of_trucks: 5,
            location: {lat: 47.63925365016244, lng: -122.39469051361084}
        },
        {
            id: 4,
            zone_id: 4,
            no_of_trucks: 5,
            location: {lat: 47.61545019698576, lng: -122.3124647140503}
        },
        {
            id: 5,
            zone_id: 5,
            no_of_trucks: 5,
            location: {lat: 47.557617362794026, lng: -122.38106489181519}
        },
        {
            id: 6,
            zone_id: 6,
            no_of_trucks: 5,
            location: {lat: 47.56213513916552, lng: -122.32317209243774}
        },
    ];

    angular.module('demoApp')
        .value('TRUCK_HQ', truckHQ)
        .value('TRUCK_ICON', '/resources/images/markers/truck.png')
    ;

}());


