module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['templates/*.html'],
                tasks: ['build']
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

    grunt.registerTask('build', ['handlebars']);

};
