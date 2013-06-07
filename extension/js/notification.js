(function(window) {

    function cancel(notification) {
        return function() {
            notification.cancel();
        }
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
        showNotification(this.notifyImg, 'Hello', 'Test')
    };

    Notification.prototype.notifyJobStatusChange = function(name, oldColor, newColor) {
        console.log('notify status change: ', oldColor, newColor);
        showNotification(this.notifyImg, 'Status Change',
                         name + '\nfrom ' + oldColor + ' to ' + newColor,
                         this.stayDelay);
    };

    Notification.prototype.notifyRemoveJob = function(name) {
        console.log('notify job remove: ', name);
        showNotification(this.notifyImg, 'Remove',
                         'Job ' + name + ' removed',
                         this.stayDelay);
    };

    Notification.prototype.notifyNewJob = function(name) {
        console.log('notify job add: ', name);
        showNotification(this.notifyImg,
                         'New', 'Job ' + name + ' added',
                         this.stayDelay);
    };

    window.Notification = Notification;

} (window));