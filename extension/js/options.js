function save_options() {
    var info = document.querySelector('#info'),
    input = document.querySelector('#jenkins-url'),
    url = input.value;

    chrome.storage.local.set({'jenkins_url': url}, function() {
        info.innerHTML = 'saved';
    });
}


function restore_options() {
    var input = document.querySelector('#jenkins-url');

    chrome.storage.local.get('jenkins_url', function(items) {
        input.value = items['jenkins_url'];
    });
}


document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#jenkins-url').addEventListener('input', save_options);