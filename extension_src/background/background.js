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
