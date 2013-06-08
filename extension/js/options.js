(function(window, $) {

    function save_options() {
        var input = $('#jenkins-url'),
            info = input.next(),
            url = input.val();

        if (url === '') {
            url = null;
        }

        chrome.storage.local.set({'jenkins_url': url}, function() {
            info.addClass('text-success')
                .text(' saved').prepend($('<i></i>', { 'class': 'icon-ok' }));
        });

        chrome.runtime.getBackgroundPage(function(backend) {
            backend.refresh();
        });
    }


    function restore_options() {
        var input = $('#jenkins-url');

        chrome.storage.local.get('jenkins_url', function(items) {
            input.val(items['jenkins_url']);
        });
    }

    $(document).on('change', '#jenkins-url', function() {
        save_options();
    });

    $(function() {
        restore_options();
    });

} (window, jQuery));
