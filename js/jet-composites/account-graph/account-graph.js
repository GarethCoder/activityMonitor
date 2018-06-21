define(
    ['ojs/ojcore', 'knockout', 'jquery', 'helper', 'jszip', 'xlsx', 'filesaver', 'ojs/ojknockout', 'promise', 'ojs/ojtable', 'ojs/ojarraydataprovider', 'ojs/ojbutton', 'serviceworker'],
    function (oj, ko, $) {
        'use strict';

        function AccountGraphicsComponentModel(context) {
            var self = this;
            $(document).ready(() => {
                $("#accounttable").addClass("offGrid");
                // $("#pieChart").addClass('offGrid');
            });

            self.composite = context.element;
            self.highlightChars = [];
            self.logArray = ko.observableArray([]);
            self.data = ko.observableArray();
            self.configData = ko.observableArray();
            self.logArray = ko.observableArray([]);


            self.columnArray = ko.observableArray();

            self.dataprovider = ko.observable(new oj.ArrayDataProvider([], {
                idAttribute: 'accountId'
            }));

            var headers = [];

            var count = 0;
            /// ACCOUNTS TABLE
            const AccountFunctions = () => {
                const initialiseTable = async (logData, configData) => {
                    // Get Data
                    let modifiedLogs = modifyData(logData, configData);

                    console.log('building table headers')
                    createTableHeaders(modifiedLogs);

                    self.dataprovider(new oj.ArrayDataProvider(modifiedLogs));

                    self.logArray(modifiedLogs);
                };

                const modifyData = (logData, configData) => {
                    let Accounts = [];
                    let accountsArray = [];
                    let accounts = {};


                    logData.forEach(log => {
                        if (log.account) {
                            if (accounts[log.account] === undefined) {
                                accounts[log.account] = 1;
                                accountsArray.push({
                                    account: log.account,
                                    description: ""
                                });
                            };
                        } else if (!log.account) {
                            log.account = "Unregistered Account";

                            if (accounts[log.account] === undefined) {
                                accounts[log.account] = "Unregistered Account";
                                accountsArray.push({
                                    account: "Unregistered Account",
                                    value: "Unregistered Account"
                                })
                            };
                        };

                        if (log.datetime) {
                            let convertedDate = new Date(log.datetime).toDateString();
                            let convertedTime = new Date(log.datetime).toLocaleTimeString();
                            log.datetime = `${convertedDate} ${convertedTime}`;
                        };

                        Accounts.push(log);
                    });

                    try {
                        Accounts.forEach((acc) => {
                            let currentAcc = acc.account;

                            configData.accounts.forEach(configAcc => {
                                if (configAcc.id === currentAcc) {
                                    acc.account = configAcc.description;
                                }
                            });

                        });
                    } catch (error) {
                        return Accounts;
                    }


                    return Accounts;
                };

                const createTableHeaders = function (logs) {
                    let rowData = [];
                    headers = [];
                    if (logs.length > 0) {
                        var keys = Object.keys(logs[0])

                        for (var i = 0; i < keys.length; i++) {
                            let objectMap = {
                                headerText: "",
                                field: ""
                            };
                            if (keys[i] === "__v" || keys[i] === "_id") {
                                // skip these values
                            } else {
                                objectMap.headerText = keys[i];
                                objectMap.field = objectMap.headerText;
                                headers.push(objectMap);
                            };
                        };
                        self.columnArray(headers);
                    };

                }
                return {
                    initialiseTable
                };
            };

            // EXCEL EXPORT
            self.exportFile = async () => {
                $("#exportFileBtn").addClass('loading');
                let modifiedHeadings = [];

                console.log(self.columnArray());

                self.columnArray().forEach(heading => {
                    let upperCaseHeading = heading.headerText.charAt(0).toUpperCase() + heading.headerText.slice(1);
                    if (upperCaseHeading == 'Datetime') {
                        upperCaseHeading = 'Date/Time';
                    };
                    modifiedHeadings.push(upperCaseHeading);
                });

                console.log(modifiedHeadings);

                export_table_to_excel("Appshare", "Accounts", "accounttable", undefined, modifiedHeadings);

                console.log('loading...');

                $("#exportFileBtn").removeClass('loading');
            };

            /// ACTION CHART
            self.dataLabelPositionValue = ko.observable('outsideSlice');
            self.pieSeriesValue = ko.observableArray([]);

            const ActionChart = () => {
                const initialiseChart = (logData) => {
                    let filterData = modifyData(logData);
                };

                const modifyData = (logData) => {
                    let actions = {};
                    let pieSeries = [];

                    logData.forEach(log => {
                        if (actions[log.action] === undefined) {
                            actions[log.action] = 1;
                        } else {
                            actions[log.action] += 1;
                        };
                    });

                    for (var action in actions) {
                        let actionName = action;
                        let actionValue = actions[action];

                        let actionObj = {
                            name: actionName,
                            items: [actionValue],
                            pieSliceExplode: 0
                        };
                        pieSeries.push(actionObj);
                    };

                    self.pieSeriesValue(pieSeries);
                };
                return {
                    initialiseChart
                }
            }

            let actionChart = ActionChart();

            self.hiddenCategories = ko.observableArray([]);

            self.composite.addEventListener('dataChanged', (evt) => {

                context.props.then((propertyMap) => {
                    self.properties = propertyMap;

                    AccountFunctions().initialiseTable(self.properties.data, self.properties.config);
                    actionChart.initialiseChart(self.properties.data);
                    self.data(self.properties.data);
                    self.configData(self.properties.config);

                    if (self.properties.data !== self.data() || self.properties.config !== self.configData()) {
                        AccountFunctions().initialiseTable(self.properties.data, self.properties.config);
                        actionChart.initialiseChart(self.properties.data);
                        self.data(self.properties.data);
                        self.configData(self.properties.config);
                    };
                });
            });
        };
        return AccountGraphicsComponentModel;
    });