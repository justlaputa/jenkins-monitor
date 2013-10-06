module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['templates/*.html'],
                tasks: ['build']
            }
        },

        copy: {
            lib: {
                files: [
                {
                    expand: true,
                    flatten: true,
                    dest: 'extension/js/lib/',
                    src: [
                    'bower_components/jquery/jquery.js',
                    'bower_components/jquery/jquery.min.map',
                    'bower_components/bootstrap/docs/assets/js/bootstrap.js',
                    'bower_components/handlebars/handlebars.runtime.js'
                    ]
                },
                {
                    expand: true,
                    flatten: true,
                    dest: 'extension/css/',
                    src: [
                    'bower_components/bootstrap/docs/assets/css/bootstrap*.css',
                    'bower_components/font-awesome/css/font-awesome.css'
                    ]
                },
                {
                    expand: true,
                    flatten: true,
                    dest: 'extension/img/',
                    src: [
                    'bower_components/bootstrap/docs/assets/img/glyphicons*.png',
                    ]
                },
                {
                    expand: true,
                    flatten: true,
                    dest: 'extension/font/',
                    src: [
                    'bower_components/font-awesome/font/*'
                    ]
                }
                ]
            }
        },

        handlebars: {
            compile: {
                options: {
                    namespace: 'templates',
                    partialsUseNamespace: true,
                    processName: function(filename) {
                        return filename.replace('templates/', '').replace('.html', '');
                    }
                },
                files: {
                    'extension/js/template.js': 'templates/*.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('build', ['handlebars', 'copy:lib']);

};
