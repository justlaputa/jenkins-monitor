/** json job status color:
 * "aborted"
 * "aborted_anime"
 * "blue"
 * "blue_anime"
 * "disabled"
 * "grey"
 * "red"
 * "red_anime"
 * "yellow"
 * "yellow_anime"
 */

$(function() {
    var remoteUrl = 'https://builds.apache.org/api/json?tree=jobs[color,name]',
        localUrl = 'jenkins.json',

        color_map = {
            'aborted': '', //aborted
            'aborted_anime': '', //aborted
            'blue': 'success',//success
            'blue_anime': 'success',//success
            'disabled': 'inverse',//disabled
            'disabled_anime': 'inverse',//disabled
            'grey': 'info',    //pending
            'grey_anime': 'info',    //pending
            'red': 'important',     //failed
            'red_anime': 'important',     //failed
            'yellow': 'warning',   //unstable
            'yellow_anime': 'warning'   //unstable
        };

    function processData(data) {
        data['jobs'].forEach(function(job) {
            var bootstrap_type = color_map[job.color];

            if (bootstrap_type) {
                job.color_type = bootstrap_type;
            }

            if (job.color.search(/_anime$/) !== -1) {
                job.in_progress = true;
            }
        });

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
        url: localUrl,
        dataType: 'json',
        success: function(data) {
            processData(data);

            showLoadingSpin(false);

            renderJenkinsJobs(data);

        },
        error: function() {

            showLoadingJenkinsFail();

        }
    });

});
