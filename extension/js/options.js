(function(window, $) {

    function save_options(option, callback) {

        chrome.storage.local.get('options', function(items) {
            var options = items['options'] || {},
            name;

            for (name in option) {
                options[name] = option[name];
            }

            chrome.storage.local.set({'options': options}, function() {
                callback();

                chrome.runtime.getBackgroundPage(function(backend) {
                    backend.restart();
                });
            });
        });
    }

    function restore_options() {

        chrome.storage.local.get('options', function(items) {
            var options = items['options'],
            name,
            val;

            for (name in options) {
                val = options[name];

                $('#options-form input[name="' + name + '"]').val(val);
            }
        });
    }

    $(document).on('change', '#options-form input', function() {
        var input = $(this),
        option = {},
        name = input.attr('name'),
        value = input.val();

        option[name] = value;

        save_options(option, function() {
            if (input.attr('type') === 'range') {
                input.next().val(value);
            }

            input.parent().find('span.save-info')
            .addClass('text-success')
            .text(' saved')
            .prepend($('<i></i>', { 'class': 'icon-ok' }));
        });
    });

    $(function() {
        restore_options();
    });

} (window, jQuery));
