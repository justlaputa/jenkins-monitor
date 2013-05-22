var lastSuccessTime = null,

JenkinsUrl = '',

listener,

Query = {
    jobs: 'api/json?tree=jobs[color,name]'
};

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

    getOptions(function(options) {
        var url = options['jenkins_url'];

        if (!url) {
            console.log('no option for jenkins url')

            showInactiveIcon();
            return;
        }

        console.log('got jenkins url: ', url);

        if(url[url.length - 1] !== '/') {
            url += '/';
        }

        $.ajax(url + Query.jobs).then(function(data) {
            var iconText;

            storeData(data);

            iconText = Object.keys(data.jobs).length.toString();

            console.log('get jenkins data, jobs count ', iconText);

            setIcon(iconText);

            if (listener) {
                listener(data);
            }

        }, function() {
            showLoadingFail();
        })

    })
}


function start() {

    console.log('start');

    requestData();

    chrome.alarms.create('refresh', {periodInMinutes: 5});
}

// start request when user open browser or update extensions
chrome.runtime.onInstalled.addListener(start);
chrome.runtime.onStartup.addListener(start);

chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log('alarm: ', alarm.name);

    if (alarm.name === 'refresh') {
        requestData();
    }

});
//======= public API =======//

function onData(callback) {
    if (callback) {
        listener = callback;
    }
}

function getData(callback) {
    chrome.storage.local.get('jenkins_jobs', function(items) {
        if (items['jenkins_jobs']) {
            callback(items['jenkins_jobs']);
        } else {
            requestData();
            callback(null);
        }
    });
}
