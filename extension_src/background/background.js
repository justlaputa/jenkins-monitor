/*
 * background.js
 * running in the chrome extension's event pages, behave as the background
 * service for this extension.
 *
 * it manages the scrape loop to pull jobs data from jenkins server periodically.
 * it also do some simple calculation to make some statistic data for the jenkins
 * jobs.
 * it stores the jobs data into chrome local storage.
 * it send 'data' event message to popup page, so it can get new data from the
 * shared local storage.
 * it also checks the jenkins jobs status change, and trigger chrome notification
 * based on user's notification preferences.
 *
 * Refer to these chrome develop pages:
 * - https://developer.chrome.com/extensions/event_pages
 * - https://developer.chrome.com/extensions/messaging
 */
import Options from '../options';

/* array of jenkins targets to scrape, each element looks like:
   {
   url: 'http://test.jenkins.com',
   name: 'test-jenkins',
   id: 'xxxx-xxxx-xxxx-xxxx', // uuid of jenkins server
   interval: 120 // refresh interval to this jenkins server
   }
*/
var JenkinsTargets = [];

/* hash map of jenkins targets, the key is jenkins target id
   {
   'xxxx-xxxx-xxxx-xxxx': {
   url: '',
   name: '',
   id: '',
   interval: 120
   }
   }
*/
var JenkinsTargetsHash = {};

function start() {
  reloadConfig()
    .then(resetTimer)
    .then(resetNotification);
}

function reloadConfig() {
  return Options.getAll()
    .then((options) => {
      if (options['jenkins']) {
        JenkinsTargets = options['jenkins'].slice();
        JenkinsTargetsHash = buildTargetHash(JenkinsTargets);
      } else {
        console.log('no jenkins options found, skip');
      }
    });
}

function resetTimer() {
  return new Promise((resolve, reject) => {
    chrome.alarms.clearAll((wasCleared) => {
      console.debug('clear all alarm: ', wasCleared);

      JenkinsTargets.forEach((target) => {
        let name = 'jenkins-' + target.id;
        console.debug('create new alarm for %s at interval %d mins',
                      target.name || name, target.interval);

        chrome.alarms.create(name, {
          periodInMinutes: target.interval
        });
      });

      resolve();
    });
  });
}

function resetNotification() {
  return;
}

function extractJenkinsId(alarmName) {
  return alarmName.substring('jenkins-'.length);
}

function getJenkinsJobsApiUrl(jenkinsUrl) {
  return jenkinsUrl + 'api/json?tree=jobs[color,name,url]';
}

function fetchJenkinsData(jenkinsId) {
  if (!JenkinsTargetsHash[jenkinsId]) {
    console.log('can not find jenkins config for id: %s', jenkinsId);
    return;
  }

  let fetchUrl = getJenkinsJobsApiUrl(JenkinsTargetsHash[jenkinsId].url);

  fetch(fetchUrl)
    .then(status)
    .then(json)
    .then(function(data) {
      console.log('Request succeeded with JSON response', data);
    }).catch(function(error) {
      console.log('Request failed', error);
    });

  function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function json(response) {
    return response.json();
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('alarm fired: %s', alarm.name);
  if (alarm.name.startsWith('jenkins-')) {
    console.debug('got jenkins refresh alarm, start request jenkins server...');

    let id = extractJenkinsId(alarm.name);
    fetchJenkinsData(id);
  } else {
    console.log('unknown alarm, ignore it');
  }
});

if (chrome.runtime && chrome.runtime.onStartup) {
  chrome.runtime.onStartup.addListener(() => {
    console.log('browser startup, start jenkins-monitor background process...');

    start();
  });
}
