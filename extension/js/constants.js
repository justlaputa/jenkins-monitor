(function(window) {

    window.ColorMap = {
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
        },
        'aborted_anime': {
            status: 'aborted',
            building: true,
            type: ''
        },
        'blue_anime': {
            status: 'succeed',
            building: true,
            type: 'success'
        },
        'disabled_anime': {
            status: 'disabled',
            building: true,
            type: 'inverse'
        },
        'grey_anime': {
            status: 'pending',
            building: true,
            type: 'info'
        },
        'red_anime': {
            status: 'failed',
            building: true,
            type: 'important'
        },
        'yellow_anime': {
            status: 'unstable',
            building: true,
            type: 'warning'
        },
        'notbuilt': {
            status: 'aborted',
            type: ''
        }
    };

    window.StatusMap = {
        'aborted': 'grey',
        'succeed': 'green',
        'disabled': 'grey',
        'pending': 'blue',
        'failed': 'red',
        'unstable': 'yellow'
    };

} (window));