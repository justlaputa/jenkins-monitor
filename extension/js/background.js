(function(window, $) {

    var lastSuccessTime = null,

    options = null,

    jenkins = [],

    notification = null,

    listeners = {};

    function emit(event, data) {
        console.log('emiting event: ', event);

        if (listeners[event]) {
            listeners[event](data);
        }
    }

    function setIcon(text) {
        chrome.browserAction.setBadgeText({ text: text });
    }

    function setIconColor(color) {
        chrome.browserAction.setBadgeBackgroundColor({color: color});
    }

    function showInactiveIcon() {
        setIcon('options');
    }

    function showLoadingFail() {
        setIcon('fail');
    }

    function getOptions(callback) {
        chrome.storage.local.get('options', function(items) {
            callback(items['options']);
        });
    }

    function storeData(key, value, callback) {
        var items = {};
        items[key] = value;
        chrome.storage.local.set(items, function() {
            console.log('store data: ', key, value);
            if (callback) {
                callback();
            }
        });
    }

    function retrieveData(key, callback) {
        chrome.storage.local.get(key, function(items) {
            console.log('retrieve data: ', items);
            callback(items[key]);
        });
    }

    function hashJobByNames(jobsData) {
        var hash = {},
        i;

        for (i = 0; i < jobsData.length; i++) {
            hash[jobsData[i].name] = {
                color: jobsData[i].color,
                url: jobsData[i].url,
                seq: i
            };
        }

        return hash;
    }

    function makeNotification(oldData, newData) {
        var oldJobs, newJobs,
        name, oldJob, newJob,
        oldStatInfo, newStatInfo;

        oldJobs = hashJobByNames(oldData.jobs);
        newJobs = hashJobByNames(newData.jobs);

        for ( name in oldJobs) {
            oldJob = oldJobs[name];
            newJob = newJobs[name];

            if (newJob) {
                oldStatInfo = ColorMap[oldJob.color];
                newStatInfo = ColorMap[newJob.color];

                if (newStatInfo.building && !oldStatInfo.building) {

                    notification.notifyJobBuildStart(name, oldStatInfo.status, oldJob.url);

                } else if (!newStatInfo.building && oldStatInfo.building) {

                    notification.notifyJobBuildDone(name, oldStatInfo.status, newStatInfo.status, oldJob.url);

                } else if (newStatInfo.status !== oldStatInfo.status) {

                    notification.notifyJobStatusChange(name, oldStatInfo.status, newStatInfo.status, oldJob.url);
                }
            } else {
                notification.notifyJobRemove(name, oldStatInfo.status, oldJob.url);
            }
        }

        for (name in newJobs) {
            newJob = newJobs[name];
            if (!oldJobs[name]) {
                notification.notifyJobAdd(name, ColorMap[newJob.color].status, newJob.url);
            }
        }
    }

    function updateWatched(oldData, newData) {
        var oldJobs = {},
            newJobs, name, oldJob, newJob;

        newJobs = hashJobByNames(newData.jobs);

        if (oldData) {
            oldJobs = hashJobByNames(oldData.jobs);
        }

        for (name in newJobs) {
            newJob = newJobs[name];
            oldJob = oldJobs[name];

            newData.jobs[newJob.seq].watched = !!(oldJob && oldData.jobs[oldJob.seq].watched);
        }
    }

    function handleNewData(newData) {
        chrome.storage.local.get('jenkins_jobs', function(items) {
            var oldData = items['jenkins_jobs'];

            if (oldData) {
                console.log('get old data from storage, ', oldData);
                makeNotification(oldData, newData);
            } else {
                console.log('no old data found');
            }

            updateWatched(oldData, newData);

            storeData('jenkins_jobs', newData, function() {
                console.log('data stored');
            });
        });
    }

    function requestData() {
        console.log('start to request data');

        setIcon('Loading...');

        emit('loading');

        jenkins.getJobs(function(err, data) {
            if (err) {
                console.log('failed to fetch remote data');

                setIcon('fail');

                emit('error', err);
            } else {
                console.log('got data from remote: ', data);

                setIcon(data.jobs.length.toString());
                var failed = false;
                $.each(data.jobs,function(index,object){
                    if(object.color == "red"){
                        failed = true;
                    }
                })
                if (failed == true){
                    setIconColor('#FF0000');
                } else {
                    setIconColor('#00FF00');
                }

                data.timestamp = new Date();

                handleNewData(data);

                emit('data', data);
            }
        });
    }


    function start() {

        console.log('start');

        chrome.storage.local.set({'jenkins_jobs': null}, function() {
            console.log('cleared old jobs data');

            notification = new Notification();
            refresh();
        });
    }

    function refresh() {
        getOptions(function(options) {
            var refresh_time;

            if (!options['jenkins-url'] || options['jenkins-url'].length === 0) {
                console.log('no option set for jenkins url');
                setIcon('no');
                return;
            }

            console.log('get options: ', options);

            jenkins = options['jenkins-url'].map(function(url) {
              return new Jenkins(url);
            });

            requestData();

            refresh_time = parseInt(options['refresh-time'], 10);

            chrome.alarms.create('refresh', {periodInMinutes: refresh_time});
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

        listeners[event] = callback;
        console.log('register listener', event, listeners[event]);
    };

    window.restart = function() {
        start();
    };

    window.refresh = function() {
        refresh();
    };

    window.toggleWatch = function(jobName, watch) {
        console.log('toggle watch for: ', jobName);

        retrieveData('jenkins_jobs', function(data) {
            var found = false;

            data.jobs.forEach(function(job) {
                if (job.name === jobName) {
                    found = true;

                    console.log('found job, watched: ', job.watched);

                    if (watch === undefined) {
                        job.watched = !job.watched;
                    } else {
                        job.watched = !!watch;
                    }
                    return false;
                }
                return true;
            });

            if (found) {
                storeData('jenkins_jobs', data);
            }
        });
    };

    //compatibility api
    window.getData = function(callback) {
        chrome.storage.local.get('jenkins_jobs', function(items) {
            if (items['jenkins_jobs']) {
                callback(items['jenkins_jobs']);
            } else {
                requestData();
                callback(null);
            }
        });
    };

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
    };
} (window, jQuery) );
