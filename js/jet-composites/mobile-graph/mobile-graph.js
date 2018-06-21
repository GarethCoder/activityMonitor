/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojpictochart', 'ojs/ojlegend', 'serviceworker'],
    function (oj, ko, $) {
        'use strict';

        function MobileComponentModel(context) {
            var self = this;
            self.composite = context.element;

            self.data = ko.observableArray();
            self.legendSections = ko.observableArray();
            self.symbolWidth = ko.observable(22);
            self.symbolHeight = ko.observable(22);

            function MobileChartView(data) {
                self.legendSections([])

                let totalDesktopDevices = data.filter(log => {
                    if (log.mobile === false) {
                        if (log.action == 'login') {
                            return log;
                        }
                    };
                });

                let totalMobileDevices = data.filter(log => {
                    if (log.mobile === true) {
                        if (log.action == 'login') {
                            return log;
                        }
                    };
                });

                let totalLogins = totalDesktopDevices.length + totalMobileDevices.length;

                let totalDesktops = Number(totalLogins) - Number(totalMobileDevices.length);

                let totalMobile = Number(totalLogins) - Number(totalDesktops);

                self.legendSections([{
                    items: [{
                            text: `${totalDesktops} Desktops`,
                            color: "#267db3",
                            markerShape: "human"
                        },
                        {
                            text: `${totalMobile} Mobile`,
                            color: "#68c182",
                            markerShape: "human"
                        }
                    ]
                }]);
            };

            self.composite.addEventListener('dataChanged', (evt) => {
                new MobileChartView(evt.detail.value);
                self.data(evt.detail.value);

                if (self.data() !== evt.detail.value) {
                    new MobileChartView(evt.detail.value);
                    self.data(evt.detail.value);

                }
            });
        };
        return MobileComponentModel;
    });