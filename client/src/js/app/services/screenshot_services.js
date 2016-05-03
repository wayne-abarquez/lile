(function(){
'use strict';

angular.module('demoApp')
    .factory('screenshotServices', ['$rootScope', '$timeout', '$q', 'gmapServices', 'layerGmapServices', 'uploadServices', 'loaderServices', screenshotServices]);

    function screenshotServices ($rootScope, $timeout, $q, gmapServices, layerGmapServices, uploadServices, loaderServices) {
        var service = {};

        var listeners = {};

        var screenshotDrawingManager,
            screenshotDrawingListener
        ;

        service.initialize = initialize;
        service.endService = endService;

        function initialize () {
            watchShapeAtrributesValue();
        }

        function watchShapeAtrributesValue() {
            listeners.startScreenshot = $rootScope.$on('start-screenshot', startScreenshot);
        }

        function stopScreenshot() {
            if (screenshotDrawingManager) {
                gmapServices.hideDrawingManager(screenshotDrawingManager);
                screenshotDrawingManager = null;
            }

            if (screenshotDrawingListener) {
                gmapServices.removeListener(screenshotDrawingListener);
                screenshotDrawingListener = null;
            }
        }

        function endService () {
            stopScreenshot();
            // End Listeners
            for (var key in listeners) {
                if (listeners.hasOwnProperty(key)) {
                    if (listeners[key]) {
                        listeners[key]();
                        listeners[key] = null;
                    }
                }
            }
        }

        function startScreenshot (e, params) {
            if (!screenshotDrawingManager) {
                screenshotDrawingManager = gmapServices.createDrawingManager();
                layerGmapServices.showDrawingManager(screenshotDrawingManager);
            }

            if (!screenshotDrawingListener) {
                screenshotDrawingListener = gmapServices.addListener(
                    screenshotDrawingManager, 'overlaycomplete', function(e){
                        onFinishScreenshot(e, params.mapId);
                    });
            }

            // set drag tool
            screenshotDrawingManager.setOptions({drawingMode: null});

            screenshotDrawingManager.setOptions({
                drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
                drawingControl: false,
                rectangleOptions: {
                    fillOpacity: 0,
                    strokeOpacity: 0.9,
                    strokeColor: '#ffffff',
                    zIndex: 3
                }
            });
        }

        function onFinishScreenshot(eArgs, mapId) {
            // show loading animation
            loaderServices.toggleModalLoader();

            stopScreenshot();

            var rectangle = eArgs.overlay;
            gmapServices.hidePolygon(rectangle);

            var bounds = rectangle.getBounds();
            var upperRight = layerGmapServices.fromLatLngToContainerPixel(bounds.getNorthEast());
            var lowerLeft = layerGmapServices.fromLatLngToContainerPixel(bounds.getSouthWest());
            var box = {
                x: lowerLeft.x,
                y: upperRight.y,
                width: upperRight.x - lowerLeft.x,
                height: lowerLeft.y - upperRight.y
            };

            convertMapTransformToLeftRight();

            $timeout(function () {
                html2canvas(document.getElementById(mapId), {
                    "logging": true,
                    "imageTimeout": 120000,
                    "proxy": "/html2canvasproxy"
                }).then(function (canvas) {

                    revertMapTransform();

                    var tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = box.width;
                    tmpCanvas.height = box.height;

                    var context = tmpCanvas.getContext('2d');
                    context.drawImage(canvas, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);

                    var toBlobFunction = function (blob) {
                        //var file = uploadServices.parseScreenshotPhoto(blob);
                        //
                        //var urlCreator = window.URL || window.webkitURL;
                        //var imageUrl = urlCreator.createObjectURL(file);
                        //var img = document.createElement('img');
                        //img.onload = function () {
                        //    URL.revokeObjectURL(imageUrl);
                        //};
                        //img.src = imageUrl;
                        //document.getElementById('dialogContent_layer-detail-modal').appendChild(img);

                        uploadServices.uploadScreenshot(blob)
                            .then(function(response){
                                var link = document.createElement('a');
                                link.href = response.data.url;
                                link.target = '_blank';
                                link.click();
                            }, function(error){
                                console.log('error: ',error);
                            })
                            .finally(function(){
                                loaderServices.toggleModalLoader();
                                //$("#modal-loader").hide();
                            });

                        // upload and return pdf form
                        // hide loading animation
                    };

                    tmpCanvas.toBlob(toBlobFunction);
                });
            });
        }

        var mapInitialTransform = '';

        /**
         * Fix for screenshot when Google Map is scrolled or panned.
         * Thanks for answer from: http://stackoverflow.com/questions/24046778/html2canvas-does-not-work-with-google-maps-pan
         */
        function convertMapTransformToLeftRight() {
            mapInitialTransform = $(".gm-style>div:first>div").css("transform");
            var comp = mapInitialTransform.split(",") //split up the transform matrix
            var mapleft = parseFloat(comp[4]) //get left value
            var maptop = parseFloat(comp[5])  //get top value
            $(".gm-style>div:first>div").css({ //get the map container. not sure if stable
                "transform": "none",
                "left": mapleft,
                "top": maptop
            });
        }

        function revertMapTransform() {
            $(".gm-style>div:first>div").css({
                "transform": mapInitialTransform,
                left: 0,
                top: 0
            });
        }

        return service;
    }
}());