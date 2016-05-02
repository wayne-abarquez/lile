(function () {
    'use strict';

    angular.module('demoApp')
        .factory('infoWindowServices', ['layerGmapServices', 'gmapServices', infoWindowServices]);

    function infoWindowServices(layerGmapServices, gmapServices) {
        var uniqueId = 0;
        var openList = [];
        var closeList = [];

        var contentInputHTML = "<div class='infowindow-input-container'><input id='infowindow-input-{0}' type='text' value='{1}' size='{2}' placeholder='Enter text...'></input></div>";
        var contentDisplayHTML = "<div class'infowindow-input-container'><label id='infowindow-label-{0}'>{1}</label></div>";

        var service = {};

        service.addInfoWindow = addInfoWindow;
        service.clearInfoWindows = clearInfoWindows;
        service.getListData = getListData;
        service.showInfoWindows = showInfoWindows;

        function addInfoWindow(position, content) {
            var infoWindow = null;

            if (closeList.length > 0) {
                var index = closeList.length - 1;
                infoWindow = closeList[index];
                closeList.splice(index, 1);
            } else {
                infoWindow = gmapServices.createInfoWindow("");
                infoWindow.uniqueId = uniqueId++;

                infoWindow.onshow = gmapServices.addListener(
                    infoWindow, 'domready', onInfoWindowShown);

                infoWindow.onclose = gmapServices.addListener(
                    infoWindow, 'closeclick', onInfoWindowClosed);
            }

            setInput(infoWindow, '');

            infoWindow.setPosition(position);
            layerGmapServices.showInfoWindow(infoWindow, null);

            if (content) {
                setInput(infoWindow, content);
                changeFromInputToLabel(infoWindow);
            }

            openList.push(infoWindow);
        }

        function clearInfoWindows() {
            //var infoWindow = null;

            //while (openList.length > 0) {
            //    infoWindow = openList[openList.length - 1];
            //    openList.splice(openList.length - 1, 1);
            //    gmapServices.hideInfoWindow(infoWindow);
            //    closeList.push(infoWindow);
            //}
            uniqueId = 0;

            closeList.forEach(function(infowindow){
               gmapServices.hideInfoWindow(infowindow);
            });
            openList.forEach(function (infowindow) {
                gmapServices.hideInfoWindow(infowindow);
            });
            closeList = [];
            openList = [];
        }

        function showInfoWindows () {
            openList.forEach(function(infowindow){
                layerGmapServices.showInfoWindow(infowindow, null);
            });
            console.log('show infowindows');
        }

        function getListData () {
            var data = [];

            openList.forEach(function(infowindow){
                data.push({
                   position: infowindow.getPosition().toJSON(),
                   content: getContent(infowindow)
                });
            });

            return data;
        }

        function setInput(infoWindow, text) {
            infoWindow.mode = 'input';
            var inputSize = text.length;
            if (inputSize < 20) inputSize = 20;
            else if (inputSize > 100) inputSize = 100;
            infoWindow.setContent(contentInputHTML.format(infoWindow.uniqueId, text, inputSize));
            var input = $('#infowindow-input-{0}'.format(infoWindow.uniqueId));
            if (input) input.val(text);
        }

        function setLabel(infoWindow, text) {
            infoWindow.mode = 'label';
            infoWindow.setContent(contentDisplayHTML.format(infoWindow.uniqueId, text));
        }

        function getContent (infoWindow) {
            if (infoWindow.mode === 'label') {
                var label = $('#infowindow-label-{0}'.format(infoWindow.uniqueId));
                return label.text();
            } else {
                var input = $('#infowindow-input-{0}'.format(infoWindow.uniqueId));
                return input.val();
            }
        }

        function changeFromInputToLabel(infoWindow) {
            if (infoWindow.mode === 'input') {
                var input = $('#infowindow-input-{0}'.format(infoWindow.uniqueId));
                if (input) {
                    setLabel(infoWindow, input.val());
                    addTextLabelListeners(infoWindow);
                }
            }
        }

        function changeFromLabelToInput(infoWindow) {
            if (infoWindow.mode === 'label') {
                var label = $('#infowindow-label-{0}'.format(infoWindow.uniqueId));
                if (label) {
                    setInput(infoWindow, label.text());
                    addTextInputListeners(infoWindow);
                }
            }
        }

        function addTextInputListeners(infoWindow) {
            if (infoWindow.mode === 'input') {
                var input = $('#infowindow-input-{0}'.format(infoWindow.uniqueId));
                var infoWindowInstance = infoWindow;
                input.on('focusout', {'infoWindow': infoWindow}, function (e) {
                    changeFromInputToLabel(e.data.infoWindow);
                });
                input.on('keyup', {'infoWindow': infoWindow}, function (e) {
                    if (e.keyCode == 13) changeFromInputToLabel(e.data.infoWindow);
                });
            }
        }

        function addTextLabelListeners(infoWindow) {
            if (infoWindow.mode === 'label') {
                var label = $('#infowindow-label-{0}'.format(infoWindow.uniqueId));
                label.on('click', {'infoWindow': infoWindow}, function (e) {
                    changeFromLabelToInput(e.data.infoWindow);
                });
            }
        }

        function onInfoWindowShown() {
            addTextInputListeners(this);
        }

        function onInfoWindowClosed(e) {
            var index = _.indexOf(openList, this);
            if (index >= 0) {
                openList.splice(index, 1);
                closeList.push(this);
            }
        }

        return service;
    }
}());