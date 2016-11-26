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

        if (name === 'jenkins-url') {
          var urls = options['jenkins-url'];
          for (var i = 0; i < urls.length; i++) {
            if (i === 0) {
              $('#options-form input[name="jenkins-url"]:eq(0)').val(urls[i]);
            } else {
              addJenkinsUrlInputBox(urls[i]);
            }
          }

        } else {
          $('#options-form input[name="' + name + '"]').val(val);
        }
      }
    });
  }

  function getJenkinsUrls() {
    var urls = [];

    $('#options-form .control-group.jenkins-url input').each(function() {
      val = $(this).val().trim();
      if (val !== '') {
        urls.push(val);
      }
    });

    return urls;
  }

  function addJenkinsUrlInputBox(url) {
    var inputText = url || "";
    var newControl = $('#options-form .control-group.jenkins-url .controls:eq(0)')
        .clone();

    newControl.find('a.add-jenkins').remove();
    newControl.find('input').val(inputText);
    newControl.appendTo('#options-form .control-group.jenkins-url');
  }

  $(document).on('change', '#options-form input', function() {
    var input = $(this),
        option = {},
        name = input.attr('name'),
        value = input.val();

    if (name === 'jenkins-url') {
      option[name] = getJenkinsUrls();
    } else {
      option[name] = value;
    }

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

  $(document).on('click', '.btn.add-jenkins', function(event) {
    event.preventDefault();
    event.stopPropagation();

    addJenkinsUrlInputBox();
  });

  $(function() {
    restore_options();
  });

} (window, jQuery));
