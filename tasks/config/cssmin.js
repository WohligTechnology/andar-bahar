/**
 * Compress CSS files.
 *
 * ---------------------------------------------------------------
 *
 * Minify the intermediate concatenated CSS stylesheet which was
 * prepared by the `concat` task at `.tmp/public/concat/production.css`.
 *
 * Together with the `concat` task, this is the final step that minifies
 * all CSS files from `assets/styles/` (and potentially your LESS importer
 * file from `assets/styles/importer.less`)
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-cssmin
 *
 */
module.exports = function (grunt) {
  var folderName = grunt.option('target') || "frontend";
  var isProduction = grunt.option('production');
  grunt.config.set('cssmin', {
    production: {
      src: [folderName + '/css/import.css'],
      dest: folderName + '/css/production.css'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
};