(function () {
'use strict';

angular.module('demoApp')
    .factory('alertServices', ['$mdToast', 'SweetAlert', alertServices]);

    function alertServices($mdToast, SweetAlert) {
        var service = {};

        service.showBottomLeftToast = showBottomLeftToast;
        service.showNoDataAvailablePrompt = showNoDataAvailablePrompt;
        service.showEntityNotFound = showEntityNotFound;
        service.showFilterSelectionEmpty = showFilterSelectionEmpty;
        service.showQueryIsEmpty = showQueryIsEmpty;

        function showBottomLeftToast(message) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position('bottom left')
                    .hideDelay(2000)
            );
        }

        function showNoDataAvailablePrompt (entityName) {
            service.showBottomLeftToast('No '+ entityName +' data available for this area.');
        }

        function showEntityNotFound(entityName) {
            SweetAlert.swal({
                title: entityName + ' not found.',
                type: 'warning'
            });
        }

        function showFilterSelectionEmpty() {
            SweetAlert.swal({
                title: 'Please select filter type.',
                type: 'warning'
            });
        }

        function showQueryIsEmpty () {
            SweetAlert.swal({
                title: 'Please fill in search query.',
                type: 'info'
            });
        }

        return service;
    }
}());