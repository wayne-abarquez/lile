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
        service.showZoneLocationInvalid = showZoneLocationInvalid;
        service.showInvalidFileUpload = showInvalidFileUpload;

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

        function showMessage(message, type) {
            SweetAlert.swal({
                title: message,
                type: type
            });
        }

        function showEntityNotFound(entityName) {
            showMessage(entityName + ' not found.', 'warning');
        }

        function showFilterSelectionEmpty() {
            showMessage('Please select filter type.', 'warning');
        }

        function showQueryIsEmpty () {
            showMessage('Please fill in search query.', 'info');
        }

        function showZoneLocationInvalid () {
            showMessage('Selected Location is out of Zone.', 'warning');
        }

        function showInvalidFileUpload() {
            showMessage('Invalid File Uploaded.', 'error');
        }

        return service;
    }
}());