// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const { JUnitXmlReporter } = require('jasmine-reporters');

process.env.CHROME_BIN = process.env.CHROME_BIN || require("puppeteer").executablePath();

exports.config = {
	allScriptsTimeout: 11000,
	specs: [
		'./src/**/*.e2e-spec.ts'
	],
	capabilities: {
		chromeOptions: {
			args: ["--headless"],
			binary: process.env.CHROME_BIN
		},
		'browserName': 'chrome'
	},
	directConnect: true,
	baseUrl: 'http://localhost:4200/',
	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000,
		print: function () { }
	},
	onPrepare() {
		require('ts-node').register({
			project: require('path').join(__dirname, './tsconfig.e2e.json')
		});
		jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
		var junitReporter = new JUnitXmlReporter({
			savePath: require('path').join(__dirname, './junit'),
			consolidateAll: true
		});
		jasmine.getEnv().addReporter(junitReporter);
	}
};