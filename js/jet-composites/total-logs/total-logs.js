/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojgauge'],
    function (oj, ko, $) {
        'use strict';

        function TotalLogsComponentModel(context) {
            var self = this;
            self.composite = context.element;

            self.logs = ko.observable(0);
            self.customers = ko.observable(0);
            self.data = ko.observableArray([]);
            self.thresholdValues = [{
                max: 33
            }, {
                max: 67
            }, {}];

            function initialiseGauge(data) {
                try {
                    let loginsMap = {};

                    data.forEach(log => {
                        if (log.action == 'login') {
                            if (loginsMap[log.action] === undefined) {
                                loginsMap[log.action] = 1;
                            } else {
                                loginsMap[log.action] += 1;
                            }
                        };
                    });

                    self.logs(loginsMap.login);
                } catch (error) {
                    console.log('could not retrieve total logins');
                };
            };


            self.composite.addEventListener('dataChanged', (evt) => {
                self.data(evt.detail.value);

                initialiseGauge(self.data());

                if (self.data() !== evt.detail.value) {
                    initialiseGauge(self.data());
                }
            });
        };

        return TotalLogsComponentModel;
    });