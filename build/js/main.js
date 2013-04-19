$(function() {
    var jenkinsUrl = 'jenkins.json';

    if(chrome && chrome.extension) {
        jenkinsUrl = chrome.extension.getURL('jenkins.json');
    }
    
    function showLoadingSpin(show) {

    }

    function renderJenkinsJobs(data) {
        $('#job-list').html(templates['joblist'](data));
    }

    function showLoadingJenkinsFail() {
        $('#job-list').text('fail to load');
    }


    showLoadingSpin(true);

    $.ajax({
        url: jenkinsUrl,
        success: function(data) {

            showLoadingSpin(false);

            renderJenkinsJobs(data);

        },
        error: function() {

            showLoadingJenkinsFail();

        }
    });

});
