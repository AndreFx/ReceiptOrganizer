module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-shell");

  const targetFiles = [
    "Gruntfile.js",
    "conf/jest.config.js",
    "src/**/*.js",
    "!**/built/**",
    "webpack.common.js",
    "webpack.dev.js",
    "webpack.prod.js"
  ];

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
    },
    clean: {
      hooks: [".git/hooks/pre-commit"]
    },
    shell: {
      hooks: {
        command: "cp git-hooks/pre-commit .git/hooks/"
      },
      test: {
        command: "npm run test"
      }
    }
  });

  grunt.registerTask("hookmeup", ["clean:hooks", "shell:hooks"]);
  grunt.registerTask("test", ["shell:test"]);
};
