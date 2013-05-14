var lastSuccessTime = null,

JenkinsUrl = '',

JenkinsData = {
    jobs: {
        query: 'api/json?tree=jobs[color,name]',
        data: {}
    }
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

        $.ajax(url + JenkinsData.jobs.query).then(function(data) {
            var iconText;

            JenkinsData.jobs.data = data;

            iconText = Object.keys(data.jobs).length.toString();

            console.log('get jenkins data, jobs count ', iconText);

            setIcon(iconText);
        }, function() {
            showLoadingFail();
        })

    })
}


function start() {

    console.log('start');

    chrome.alarms.create('refresh', {periodInMinutes: 0.17});
}

// start request when user open browser or update extensions
//chrome.runtime.onInstalled.addListener(start);
//chrome.runtime.onStartup.addListener(start);

chrome.alarms.onAlarm.addListener(function(alarm) {

    if (alarm.name === 'refresh') {
        requestData();
    }

});
//======= public API =======//

function Jenkins() {

}

Jenkins.prototype.addListener = function(listener) {
    listener = listener;
}

Jenkins.prototype.update = function() {
    startRequest();
}

window.Jenkins = new Jenkins();

start();
