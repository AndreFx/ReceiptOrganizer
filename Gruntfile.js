module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-prettier');

    const targetFiles = [
        'Gruntfile.js',
        'src/**/*.js',
        '!**/built/**'
    ];

    grunt.initConfig({
        eslint: {
            options: {
                configFile: 'conf/eslint.json'
            },
            target: targetFiles
        },
        prettier: {
            files: targetFiles,
            options: {
                progress: true
            }
        },
        watch: {
            files: targetFiles,
            tasks: ['eslint']
        }
    });
};
