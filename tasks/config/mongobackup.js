module.exports = function (grunt) {

    grunt.config.set('mongobackup', {
        dump: {
            options: {
                host: 'localhost',
                db: 'andarbahar',
                out: './dump'
            }
        },
        restore: {
            options: {
                db: 'andarbahar',
                host: 'localhost',
                drop: true,
                path: './dump/andarbahar'
            }
        },
    });

    grunt.loadNpmTasks('mongobackup');
};