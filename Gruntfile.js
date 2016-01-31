/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      main: {
        files: ['src/browser.js','src/NMath/*.js'],
        tasks: ['import:main']
      }
    },
    import: {
      main: {
        src: 'src/browser.js',
        dest: 'dist/NMath.js'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-import');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['import:main','watch:main']);

};
