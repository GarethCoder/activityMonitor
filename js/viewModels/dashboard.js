define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "serviceworker",
  "ojs/ojknockout",
  "ojs/ojlabel",
  "ojs/ojcheckboxset",
  "ojs/ojformlayout",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojbutton",
  "ojs/ojtimezonedata",
  "ojs/ojlabel",
  'ojs/ojtoolbar',
  "jet-composites/modules-graph/loader",
  "jet-composites/account-graph/loader",
  "jet-composites/mobile-graph/loader",
  "jet-composites/mobile-graph/loader",
  "jet-composites/total-logs/loader",
  'jet-composites/retention-graph/loader'
], function (oj, ko, $) {
  function DashboardViewModel() {
    var self = this;
    self.nowrap = ko.observable(false);

    $("body").css("overflow", "hidden");

    // LOADING
    self.loadingValue = ko.observable("Loading...");

    let counter = 0;
    self.val = ko.observable();
    self.isDisabled = ko.observable(false);
    self.accounts = ko.observableArray([]);
    let accountsArray = [];

    self.logs = ko.observableArray();
    self.configData = ko.observableArray();

    self.readSinceDate = ko.observable();

    var rawData = [];

    const dataImports = (url) => {
      console.log(url);
      let globalConfig;
      // pull in config data
      serviceworker
        .getConfigData("GET", `//${url}/readconfig`)
        .done(config => {
          self.configData(config);
          readableSince(config);

          // pull in log data
          if (config) {
            serviceworker
              .getLogData("GET", `//${url}/readactivity/` + config.activityRetentionDays)
              .done(logs => {
                loading('data');

                self.logs(logs);
                rawData = logs;

                buildDropDownList(true);
              });
          } else {
            serviceworker
              .getLogData("GET", `//${url}/readactivity/0`)
              .done(logs => {
                loading('data');

                self.logs(logs);
                rawData = logs;

                buildDropDownList(true);
              });
          }
        });

    };

    // readable since (retention days)
    const readableSince = (config) => {
      let retentionDays = Number(config.activityRetentionDays);

      let today = new Date();

      let lastRecorder = new Date(today.getTime() - (retentionDays * 24 * 60 * 60 * 1000));

      let day = lastRecorder.getDate();
      let month = lastRecorder.getMonth() + 1;
      let year = lastRecorder.getFullYear();

      let getDatePrior = new Date(`${month}-${day}-${year}`).toDateString().split(" ");
      delete getDatePrior[0];
      getDatePrior[2] = `${getDatePrior[2]},`;

      self.readSinceDate(`Monitored Since:  ${getDatePrior.join(" ")}`);
    };

    // data initilisation
    const initilisation = () => {
      // check if param exist in url
      let url = new URL(window.location);

      if (url["hostname"]) {
        let host = url["hostname"];

        if (host.includes('appstage')) {
          // call appstage backend
          host = "appstagebackend.steltix.com";
          dataImports(host);
        } else if (host.includes('appshare')) {
          // call appshare backend
          host = "appsharebackend.steltix.com";
          dataImports(host);
        } else {
          // call appshare backend
          host = "localhost:3001";
          dataImports(host);
        };
      };
    };
    initilisation();

    self.selectedValue = event => {
      event.preventDefault();
      let option = event.detail.value;

      // check if param exist in url
      let url = new URL(window.location);
      if (url["search"]) {
        getParams(url["search"], option);
      } else {
        accountFilter(option);
      };
    };

    self.isSmall = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(
      oj.ResponsiveUtils.getFrameworkQuery(
        oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
      )
    );

    // For small screens: labels on top
    // For medium screens and up: labels inline
    self.labelEdge = ko.computed(function () {
      return this.isSmall() ? "top" : "start";
    }, this);

    const buildDropDownList = (configData = false) => {
      self.accounts([]);
      self.accounts.push({
        value: "All Accounts",
        label: "All Accounts",
        disabled: false
      });
      let accountList = {};

      if (configData) {
        try {
          if (self.configData().accounts.length > 0) {
            let accountTest = {};

            self.logs().forEach((log) => {
              if (log.account) {
                if (accountTest[log.account] === undefined) {
                  accountTest[log.account] = "";
                  accountsArray.push({
                    account: log.account,
                    description: ""
                  })
                }
              } else if (!log.account) {
                log.account = "Unregistered Account";

                if (accountTest[log.account] === undefined) {
                  accountTest[log.account] = "Unregistered Account";
                  accountsArray.push({
                    account: "Unregistered Account",
                    value: "Unregistered Account"
                  })
                }
              }
            });

            accountsArray.forEach(acc => {
              let currentAcc = acc.account;

              self.configData().accounts.forEach(account => {
                let currentAccountId = account.id;
                if (currentAcc === currentAccountId) {
                  acc.description = account.description;
                };
              });

              self.accounts.push({
                value: currentAcc,
                label: acc.description,
                disabled: false
              });
            });
          } else {
            console.log('no accounts found');
            self.logs().forEach(log => {
              if (!log.account) {
                log.account = "Unregistered Account";
              };
              if (accountList[log.account] === undefined) {
                accountList[log.account] = 1;
                let fChar = log.account.substring(1, 0).toUpperCase();
                let oChar = log.account.slice(1);
                self.accounts.push({
                  value: fChar + oChar,
                  label: fChar + oChar,
                  disabled: false
                });
              };
            });
          };
        } catch (error) {
          console.log('No Config Data Found. Viewing Log Data Only');
          self.logs().forEach(log => {
            if (!log.account) {
              log.account = "Unregistered Account";
            };
            if (accountList[log.account] === undefined) {
              accountList[log.account] = 1;
              let fChar = log.account.substring(1, 0).toUpperCase();
              let oChar = log.account.slice(1);
              self.accounts.push({
                value: fChar + oChar,
                label: fChar + oChar,
                disabled: false
              });
            };
          });
        };

      };
    };

    const getParams = (url, query) => {
      try {
        let urlSplit = url.split("=");
        let account = urlSplit[1].replace(/%20/g, " ");

        if (account.length > 0) {
          urlFilter(account);
        } else {
          accountFilter(query, false);
        }
      } catch (error) {
        console.log("Detected Blank Params");
        urlFilter("");
      }
    };

    // URL Customer Filter
    const urlFilter = account => {
      accountFilter(account, true);
    };

    const accountFilter = (accountOption, queryDetected = false) => {
      let filteredData = [];

      if (accountOption) {
        if (accountOption.length > 0) {
          let account = accountOption.toLowerCase();
          if (account === "all accounts") {
            self.logs(rawData);
          } else {
            rawData.filter(log => {
              if (log.account.toLowerCase() === account) {
                filteredData.push(log);
              }
            });
            self.logs(filteredData);
          }
        }
      }

      try {
        if (queryDetected) {
          let fChar = filteredData[0]["account"].substring(1, 0).toUpperCase();
          let oChar = filteredData[0]["account"].slice(1);
          self.val(fChar + oChar);
          self.isDisabled(true);
        }
      } catch (error) {
        console.log("No Data Found");
      }
    };

    const loading = (message) => {
      switch (message) {
        case "components":
          self.loadingValue("Loading Dashboard Components...");
          break;
        case "data":
          self.loadingValue("Loading Dashboard Data...");
          break;
        case "finished":
          self.loadingValue("Finished...");
          break;
        default:
          break;
      };
    };

    $(document).ready(function () {
      // $(".toolbar-header").addClass('hideHeader');

      const loader = setInterval(function () {
        if (self.logs().length > 0) {
          loading('components');
          setTimeout(function () {
            clearInterval(loader);
            $("#overlay").fadeOut('slow');
            loading('finished');
            $("body").css("overflow", "auto");
            $(".toolbar-header").addClass('showHeader');

          }, 1000);

        };
      }, 500);
    });

  }
  return new DashboardViewModel();
});