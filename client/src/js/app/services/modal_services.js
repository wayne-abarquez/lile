(function(){
'use strict';

angular.module('demoApp')
    .factory('modalServices', ['$q', '$mdDialog', '$mdMedia', '$rootScope', modalServices]);

    function modalServices ($q, $mdDialog, $mdMedia, $rootScope) {
        var service = {};

        var customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var showLayerModal;

        /* Service Functions */
        service.showLayer = showLayer;
        service.closeModal = closeModal;

        function showModal (modalObj, modalParams) {
            var dfd = $q.defer();

            if(modalObj) {
                dfd.reject("Modal already opened");
            } else {
                $rootScope.$broadcast("modal-opened");

                modalObj = $mdDialog.show(modalParams);

                modalObj.then(function(result){
                    dfd.resolve(result);
                }, function(reason){
                    $rootScope.$broadcast("modal-dismissed");
                    dfd.reject(reason);
                })
                .finally(function(){
                    modalObj = null;
                });
            }

            return dfd.promise;
        }

        function showLayer (_layer, ev) {
            var opts = {
                controller: 'showLayerController',
                controllerAs: 'showLayerCtl',
                templateUrl: '/partials/modals/show_layer.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {layer: _layer},
                fullscreen: $mdMedia('lg')
            };

            return showModal(showLayerModal, opts);
        }

        // Close Modal
        function closeModal() {
            $mdDialog.cancel();
        }

        return service;
    }
}());