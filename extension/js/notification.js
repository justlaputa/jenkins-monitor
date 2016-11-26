(function(window) {

  var notificationUrlMap = { };

  function cancel(notification) {
    return function() {
      notification.cancel();
    };
  }

  function Notification() {
    this.stayDelay = 30000; //auto disapear time in miniseconds
  }

  function showNotification(img, title, content, delay, onClickUrl) {
    var notification = webkitNotifications.createNotification(img, title, content);

    var options = {
      type: 'image',
      iconUrl: img,
      title: title,
      message: content,
      isClickable: true
    };

    chrome.notifications.create(null, options, function(id) {
      notificationUrlMap[id] = onClickUrl;
    });
  }

  function getStatusIcon(status) {
    return 'img/' + StatusMap[status] + '.png';
  }

  Notification.prototype.notify = function() {
    showNotification(this.notifyImg, 'Test Notify',
                     'Hello notification', this.stayDelay);
  };

  Notification.prototype.notifyJobStatusChange = function(name, from, to, url) {
    console.log('notify status change: ', from, to);
    showNotification(getStatusIcon(to), 'Status Change: ' + name,
                     'From ' + from + ' to ' + to,
                     this.stayDelay, url);
  };

  Notification.prototype.notifyJobBuildStart = function(name, status, url) {
    console.log('notify build start: ', status);
    showNotification(getStatusIcon(status), 'Build Start: ' + name,
                     'Current status: ' + status, this.stayDelay, url);
  };

  Notification.prototype.notifyJobBuildDone = function(name, from, to, url) {
    console.log('notify job build done: ', name, from, to);
    showNotification(getStatusIcon(to), 'Build Done: ' + name,
                     'From ' + from + ' to ' + to,
                     this.stayDelay, url);
  };

  Notification.prototype.notifyJobRemove = function(name, status, url) {
    console.log('notify job remove: ', name);
    showNotification(getStatusIcon(status), 'Job Removed: ' + name,
                     'Last Status: ' + status,
                     this.stayDelay, url);
  };

  Notification.prototype.notifyJobAdd = function(name, status, url) {
    console.log('notify job add: ', name);
    showNotification(getStatusIcon(status), 'Job Added: ' + name,
                     'Status: ' + status, this.stayDelay, url);
  };

  window.Notification = Notification;

  chrome.notifications.onClicked.addListener(function(id) {
    chrome.tabs.create({url: notificationUrlMap[id]});
  });

} (window));
