(function(window) {

    function cancel(notification) {
        return function() {
            notification.cancel();
        };
    }

    function Notification() {
        this.stayDelay = 30000; //auto disapear time in miniseconds
        this.notifyImg = 'img/notify.png';
    }

    function showNotification(img, title, content, delay) {
        var notification = webkitNotifications.createNotification(img, title, content);

        notification.show();

        setTimeout(cancel(notification), delay);
    }

    Notification.prototype.notify = function() {
        showNotification(this.notifyImg, 'Test Notify',
            'Hello notification', this.stayDelay);
    };

    Notification.prototype.notifyJobStatusChange = function(name, from, to) {
        console.log('notify status change: ', from, to);
        showNotification(this.notifyImg, 'Status Change: ' + name,
                         'From ' + from + ' to ' + to,
                         this.stayDelay);
    };

    Notification.prototype.notifyJobBuildStart = function(name, status) {
        console.log('notify build start: ', status);
        showNotification(this.notifyImg, 'Build Start: ' + name,
                         'Current status: ' + status, this.stayDelay);
    };

    Notification.prototype.notifyJobBuildDone = function(name, from, to) {
        console.log('notify job build done: ', name, from, to);
        showNotification(this.notifyImg, 'Build Done: ' + name,
                         'From ' + from + ' to ' + to,
                         this.stayDelay);
    };

    Notification.prototype.notifyJobRemove = function(name, status) {
        console.log('notify job remove: ', name);
        showNotification(this.notifyImg, 'Job Removed: ' + name,
                         'Last Status: ' + status,
                         this.stayDelay);
    };

    Notification.prototype.notifyJobAdd = function(name, status) {
        console.log('notify job add: ', name);
        showNotification(this.notifyImg, 'Job Added: ' + name,
                         'Status: ' + status, this.stayDelay);
    };

    window.Notification = Notification;

} (window));
