/*
* options.js
* interact with user's preference settings in the options html page
*
* when user input or modify preferences in the options.html page, it
* stores the data into chrome shared local storage.
* when user's preference changes, it send message to both popup page
* and background event page, so the popup page can change the necessary
* UI component to show the change, and background page can reload the
* configuration for background process, like remove/add jenkins server
* url, change refresh time interval, etc.
*/
