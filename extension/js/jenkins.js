(function(window, $) {
    var query = {
        jobs: 'api/json?tree=jobs[color,name]'
    }

    function Jenkins(url) {
        this.url = url;
    }

    Jenkins.prototype.setUrl = function(url) {
        this.url = url;
    };

    //async function for getting all jenkins job data
    //callback(err, data)
    Jenkins.prototype.getJobs = function(callback) {

        $.ajax(this.url + query.jobs).then(function(data) {

            console.log('get jenkins data: ', data);

            if (callback) {
                callback(null, data);
            }

        }, function(jqXHR, status, error) {

            console.log('request for jobs fails: %s, %s', status, error);

            if (callback) {
                callback(error, null);
            }
        });
    };

    window.Jenkins = Jenkins;

} (window, jQuery) )