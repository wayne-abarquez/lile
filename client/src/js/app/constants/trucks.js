(function () {
    'use strict';

    var truckHQ = [
        {
            id: 1,
            zone_id: 1,
            no_of_trucks: 5,
            location: {lat: 0, lng: 0}
        }
    ];

    angular.module('demoApp')
        .value('TRUCK_HQ', truckHQ)
    ;

}());


