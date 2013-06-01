(function(window, $) {

    var lastSuccessTime = null,

    options = null,

    jenkins = null,

    listeners = {};

    function emit(event, data) {
        var i;

        console.log('emiting event: ', event);

        if (listeners[event]) {
            for (i = 0; i < listeners[event].length; i++) {
                listeners[event][i](data);
            }
        }
    }

    function setIcon(text) {
        chrome.browserAction.setBadgeText({ text: text });
    }

    function showInactiveIcon() {
        setIcon('options');
    }

    function showLoadingFail() {
        setIcon('fail');
    }

    function getOptions(callback) {
        chrome.storage.local.get('jenkins_url', function(items) {
            callback(items);
        });
    }

    function storeData(data) {
        chrome.storage.local.set({'jenkins_jobs': data}, function() {
            console.log('jobs data saved to storage');
        });
    }

    function requestData() {
        console.log('start to request data');

        jenkins.getJobs(function(err, data) {
            if (err) {
                console.log('fali to fetch remote data');

                emit('error', err);
            } else {
                console.log('got data from remote: ', data);

                storeData(data);
                emit('data', data);
            }
        });
    }


    function start() {

        console.log('start');

        setIcon('Loading...');

        emit('loading');

        chrome.storage.local.get('jenkins_url', function(items) {
            console.log('get options: ', items);

            options = items;
            jenkins = new Jenkins(options['jenkins_url']);
            requestData();
            chrome.alarms.create('refresh', {periodInMinutes: 0.1});
        });
    }

    // start request when user open browser or update extensions
    chrome.runtime.onInstalled.addListener(start);
    chrome.runtime.onStartup.addListener(start);

    chrome.alarms.onAlarm.addListener(function(alarm) {
        console.log('alarm: ', alarm.name);

        if (alarm.name === 'refresh') {
            console.log(alarm);
            requestData();
        }

    });
    //======= public API =======//

    window.on = function(event, callback) {
        if (!listeners[event]) {
            listeners[event] = [];
        }

        listeners[event].push(callback);
    };



    //compatibility api
    window.onData = function(callback) {
        on('data', callback);
    }

    window.getData = function(callback) {
        chrome.storage.local.get('jenkins_jobs', function(items) {
            if (items['jenkins_jobs']) {
                callback(items['jenkins_jobs']);
            } else {
                requestData();
                callback(null);
            }
        });
    }

    window.getNextRefreshTime = function(callback) {
        chrome.alarms.get('refresh', function(alarm) {
            var time;
            if (callback) {
                if (alarm) {
                    time = Math.floor((alarm.scheduledTime - Date.now()) / 1000);
                    callback(time);
                } else {
                    callback(null);
                }
            }
        });
    }
} (window, jQuery) )