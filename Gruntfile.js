module.exports = function(grunt) {
    grunt.initConfig({
        'bower-install-simple': {
            options: {
                color: true,
                cwd:'public/app/'
            },
            'prod': {
                options: {
                    production: true
                }
            },
            'dev': {
                options: {
                    production: false
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-bower-install-simple');
};