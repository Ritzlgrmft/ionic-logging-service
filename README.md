# ionic-logging-service

**The dependencies used by the latest version are the same as needed for [Ionic 2.0.0](https://github.com/driftyco/ionic/blob/master/CHANGELOG.md).**

[![Build](https://travis-ci.org/Ritzlgrmft/ionic-logging-service.svg?branch=master)](https://travis-ci.org/Ritzlgrmft/ionic-logging-service)
[![Codecov](https://codecov.io/gh/Ritzlgrmft/ionic-logging-service/branch/master/graph/badge.svg)](https://codecov.io/gh/Ritzlgrmft/ionic-logging-service)
[![Version](https://badge.fury.io/js/ionic-logging-service.svg)](https://www.npmjs.com/package/ionic-logging-service)
[![Downloads](https://img.shields.io/npm/dt/ionic-logging-service.svg)](https://www.npmjs.com/package/ionic-logging-service)
[![Dependencies](https://david-dm.org/ritzlgrmft/ionic-logging-service/master/status.svg)](https://david-dm.org/ritzlgrmft/ionic-logging-service/master)
[![Peer-Dependencies](https://david-dm.org/ritzlgrmft/ionic-logging-service/master/peer-status.svg)](https://david-dm.org/ritzlgrmft/ionic-logging-service/master?type=peer)
[![Dev-Dependencies](https://david-dm.org/ritzlgrmft/ionic-logging-service/master/dev-status.svg)](https://david-dm.org/ritzlgrmft/ionic-logging-service/master?type=dev)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/ritzlgrmft/ionic-logging-service/badge.svg)](https://snyk.io/test/github/ritzlgrmft/ionic-logging-service)
[![License](https://img.shields.io/npm/l/ionic-logging-service.svg)](https://www.npmjs.com/package/ionic-logging-service)

This service encapsulates [log4javascript](http://log4javascript.org/)'s functionalities for apps built with [Ionic framework](http://ionicframework.com).

The logging service is based on [log4javascript](http://log4javascript.org/), usings its appender and logger infrastructure.

By default, the following configuration is used:

- Logger:
  - root: `Level.WARN`

- Appender:
  - `BrowserConsoleAppender`
  - `MemoryAppender`

## Configuration

The configuration is done with the [ionic-configuration-service](https://github.com/Ritzlgrmft/ionic-configuration-service).

The specific configuration for the `ionic-logging-service` is taken from the key `logging`.
Its structure is defined in the interface [LoggingConfiguration](src/logging-configuration.model.ts).

### logLevels

`logLevels` gets an array of log level definitions, e.g.

```JavaScript
{
  "logLevels": [
    {
      "loggerName": "root",
      "logLevel": "DEBUG"
    },
    {
      "loggerName": "MyApp.MyNamespace.MyLogger",
      "logLevel": "INFO"
    }
  ]
};
````

### ajaxAppender

With `ajaxAppender`, it is possible to configure the `AjaxAppender`, which sends
log messages to a backend.

It has the following properties:

- `url`: Url to send JavaScript logs
- `timerInterval`: Interval for sending log messages; if set to 0, every
  message will be sent immediatedly; default: 0
- `threshold`: Threshold; valid values are: ALL, DEBUG, ERROR, FATAL, INFO, OFF, TRACE, WARN;
  default: ALL

### localStorageAppender

With `localStorageAppender`, it is possible to configure the `LocalStorageAppender`, which stores
log messages in the local storage.

It has the following properties:

- `localStorageKey`: Key used to store the messages in the local storage.
- `maxMessages`: Maximum number of log messages stored by the appender; default: 250
- `threshold`: Threshold; valid values are: ALL, DEBUG, ERROR, FATAL, INFO, OFF, TRACE, WARN;
  default: WARN

### memoryAppender

With `memoryAppender`, it is possible to configure the `MemoryAppender`, which stores
log messages in the memory.

It has the following properties:

- `maxMessages`: Maximum number of log messages stored by the appender; default: 250

## API

### logMessagesChanged: EventEmitter&lt;LogMessage>

Event triggered when new log message was added.

Parameters

- *message*: new log message

### ajaxAppenderFailed: EventEmitter&lt;string>

Event triggered when ajax appender could not send log messages to the server.

Parameters

- *message*: error message

### configure(configuration?: LoggingConfiguration): void

Configures the logging depending on the given configuration.

Parameters

- *configuration*: configuration data.
  If the parameter is skipped, the configuration data will be taken from configuration service, key `logging`

### getRootLogger(): Logger

Gets the root logger from which all other loggers derive.

Returns

- root logger

### getLogger(loggerName: string): Logger

Gets a logger with the specified name, creating it if a logger with that name does not already exist.

Parameters

- *loggerName*: name of the logger

Returns

- logger

### getLogMessages(): LogMessage[]

Gets the last log messages.

Returns

- log messages