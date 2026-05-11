// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-coverage'),
			require('karma-junit-reporter')
		],
		client: {
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		coverageReporter: {
			reporters: [
				{ type: 'html', subdir: 'html' },
				{ type: 'lcovonly', subdir: '.', file: 'lcov.info' },
				{ type: 'cobertura', subdir: '.', file: 'cobertura-coverage.xml' }
			],
			dir: require('path').join(__dirname, 'coverage')
		},
		reporters: ['progress', 'junit', 'coverage'],
		junitReporter: {
			outputDir: './projects/ionic-logging-service/junit'
		},
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: false
	});
};
