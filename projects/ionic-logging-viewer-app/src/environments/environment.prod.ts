export const environment = {
	production: true,

	logging: {
		"logLevels": [
			{
				"loggerName": "root",
				"logLevel": "DEBUG"
			},
			{
				"loggerName": "Ionic.Logging",
				"logLevel": "OFF"
			}
		],
		"localStorageAppender": {
			"localStorageKey": "ionic.logging.sample",
			"threshold": "INFO",
			"maxMessages": 250
		}
	}
};
