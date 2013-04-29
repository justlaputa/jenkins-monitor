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
        'aborted': {
            status: 'aborted',
            type: ''
        },
        'blue': {
            status: 'succeed',
            type: 'success'
        },
        'disabled': {
            status: 'disabled',
            type: 'inverse'
        },
        'grey': {
            status: 'pending',
            type: 'info'
        },
        'red': {
            status: 'failed',
            type: 'important'
        },
        'yellow': {
            status: 'unstable',
            type: 'warning'
        }
    };

    function processData(data) {
        data.counts = {
            'total': 0,
            'aborted': 0,
            'succeed': 0,
            'disabled': 0,
            'pending': 0,
            'failed': 0,
            'unstable': 0
        };

        data['jobs'].forEach(function(job) {

            if (job.color.search(/_anime$/) !== -1) {
                job.in_progress = true;
                job.color = job.color.replace('_anime', '');
            }

            job.color_type = color_map[job.color].type;
            job.status = color_map[job.color].status;

            data.counts[job.status]++;
            data.counts.total++;
        });

    }
    
    function showJobsInStatus(status) {
        var jobs = $('.job');

        if (status === 'all') {
            jobs.removeClass('hide');
        } else {
            jobs.addClass('hide').filter('.' + status).removeClass('hide');
        }
    }

    function showLoadingSpin(show) {
        $('#loading-spin').toggleClass('hide', show === false);
    }

    function showJobList(show) {
        $('#filter-btns').toggleClass('hide', show === false);
        $('#job-list').toggleClass('hide', show === false);
    }

    function renderJenkinsJobs(data) {
        $('#job-list').html(templates['joblist'](data));
        $('#filter-btns').html(templates['filterbtn'](data.counts));
    }

    function showLoadingJenkinsFail() {
        $('#job-list').text('fail to load');
    }

    function refresh() {
        showJobList(false);
        showLoadingSpin();

        $.ajax({
            url: localUrl,
            dataType: 'json',
            success: function(data) {
                processData(data);

                showLoadingSpin(false);
                showJobList();

                renderJenkinsJobs(data);

            },
            error: function() {

                showLoadingJenkinsFail();

            }
        });
    }

    $(document).on('click', '#filter-btns button', function() {
        var status = $(this).attr('title');

        showJobsInStatus(status);
    });

    $(document).on('click', '#refresh', function() {
        refresh();
    });

    // refresh getting remote data and render it
    refresh();

});
