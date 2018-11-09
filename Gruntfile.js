module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-contrib-watch");

  const targetFiles = ["Gruntfile.js", "src/**/*.js", "!**/built/**"];

  grunt.initConfig({
    eslint: {
      options: {
        configFile: "conf/eslint.json",
        fix: grunt.option("fix")
      },
      target: targetFiles
    },
    watch: {
      files: targetFiles,
      tasks: ["eslint"]
    }
  });
};
