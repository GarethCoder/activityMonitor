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
                            loginsMap[log.action] === undefined ? loginsMap[log.action] = 1 : loginsMap[log.action] += 1;
                        };
                    });

                    self.logs(loginsMap.login);
                } catch (error) {
                    console.log('could not retrieve total logins');
                };
            };

            context.props.then(function (propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;
                setTimeout(() => {
                    initialiseGauge(self.properties.data);

                    self.data(self.properties.data);

                    setInterval(() => {
                        if (self.properties.data !== self.data()) {
                            initialiseGauge(self.properties.data);

                            self.data(self.properties.data);
                        }
                    }, 1000)
                }, 1000)
            });
        };

        return TotalLogsComponentModel;
    });