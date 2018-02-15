# ionic-logging-service

**The dependencies used by the latest version are the same as needed for [Ionic 3.9.0](https://github.com/ionic-team/ionic/blob/master/CHANGELOG.md). For older versions use:**

| ionic-logging-service | Ionic | Angular
| ----- | -------- | ------
| 4.0.0 | >= 3.9.0 | ^5.0.0
| 3.1.0 | >= 3.0.0 | ^4.0.0
| 2.0.0 | >= 2.2.0 | ^2.4.8
| 1.2.1 | >= 2.0.0 | ^2.2.1

- **Ionic 2.0.0: version 1.2.1.**
- **Ionic 2.2.0: version 2.0.0.**

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

## Usage

```TypeScript
import { Logger, LoggingService } from "ionic-logging-service";

export class MyComponent {

  private logger: Logger;

  constructor(
    loggingService: LoggingService) {

    this.logger = loggingService.getLogger("MyApp.MyComponent");
    const methodName = "ctor";
    this.logger.entry(methodName);

    ...

    this.logger.exit(methodName);
  }

  public myMethod(index: number, message: string): number[] {
    const methodName = "myMethod";
    this.logger.entry(methodName, index, number);

    try {
      ...
    } catch (e) {
      this.logger.error(methodName, "some error", e);
    }

    this.logger.exit(methodName);
    return result;
  }
}

```

Depending how the code is called, this could produce the following output in the browser's console:

```text
I  18:49:43.794  MyApp.MyComponent  ctor  entry
I  18:49:43.797  MyApp.MyComponent  ctor  exit
I  18:49:43.801  MyApp.MyComponent  myMethod  entry  42  Hello
E  18:49:43.814  MyApp.MyComponent  myMethod  some error
I  18:49:43.801  MyApp.MyComponent  myMethod  exit  [2, 5, 99]
```

Log output in the browser's console is quite useful during development, either in console or using `ionic serve --consolelogs`. But later, you will need other logs. Here come the so-called appenders in the game:

- `AjaxAppender`: sends the log messages to a backend server
- `MemoryAppender`: keeps the log messages in memory
- `LocalStorageAppender`: stores the log messages in local storage

If you want to see a complete example, have a look at [ionic-feedback-sample](https://github.com/Ritzlgrmft/ionic-feedback-sample).

## Configuration

The configuration is done with the [ionic-configuration-service](https://github.com/Ritzlgrmft/ionic-configuration-service).

The specific configuration for the `ionic-logging-service` is taken from the key `logging`.
Its structure is defined in the interface [LoggingConfiguration](src/logging-configuration.model.ts).

By default, the following configuration is used:

- Logger:
  - root: `Level.WARN`

- Appender:
  - `BrowserConsoleAppender`
  - `MemoryAppender`

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
```

That means, instead of the default log level `WARN`, you want to log all messages with level `DEBUG` and higher. Only for `MyApp.MyNamespace.MyLogger`, you want to restrict the level to `INFO`.

### ajaxAppender

With `ajaxAppender`, it is possible to configure the `AjaxAppender`, which sends
log messages to a backend.

It has the following properties:

- `url`: Url to send JavaScript logs
- `timerInterval`: Interval for sending log messages; if set to 0, every
  message will be sent immediatedly; default: 0
- `batchSize`: Number of log messages sent in each request; default: 1
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

### LoggingService

#### logMessagesChanged: EventEmitter&lt;LogMessage>

Event triggered when new log message was added.

Parameters

- *message*: new log message

#### ajaxAppenderFailed: EventEmitter&lt;string>

Event triggered when ajax appender could not send log messages to the server.

Parameters

- *message*: error message

#### configure(configuration?: LoggingConfiguration): void

Configures the logging depending on the given configuration.

Parameters

- *configuration*: configuration data.
  If the parameter is skipped, the configuration data will be taken from configuration service, key `logging`

#### getRootLogger(): Logger

Gets the root logger from which all other loggers derive.

Returns

- root logger

#### getLogger(loggerName: string): Logger

Gets a logger with the specified name, creating it if a logger with that name does not already exist.

Parameters

- *loggerName*: name of the logger

Returns

- logger

#### getLogMessages(): LogMessage[]

Gets the last log messages.

Returns

- log messages

### Logger

#### setLogLevel(level: LogLevel): void

Sets the log level.

Parameters:

- *level*: the new log level

#### debug(methodName: string, ...params: any[]): void

Logs a message at level DEBUG.

Parameters:

- *methodName*: name of the method
- *params*: optional parameters to be logged; objects will be formatted as JSON

#### info(methodName: string, ...params: any[]): void

Logs a message at level INFO.

Parameters:

- *methodName*: name of the method
- *params*: optional parameters to be logged; objects will be formatted as JSON

#### warn(methodName: string, ...params: any[]): void

Logs a message at level WARN.

Parameters:

- *methodName*: name of the method
- *params*: optional parameters to be logged; objects will be formatted as JSON

#### error(methodName: string, ...params: any[]): void

Logs a message at level ERROR.

Parameters:

- *methodName*: name of the method
- *params*: optional parameters to be logged; objects will be formatted as JSON

#### entry(methodName: string, ...params: any[]): void

Logs the entry into a method.
The method name will be logged at level INFO, the parameters at level DEBUG.

Parameters:

- *methodName*: name of the method
- *params*: optional parameters to be logged; objects will be formatted as JSON

#### exit(methodName: string, ...params: any[]): void

Logs the exit of a method.
The method name will be logged at level INFO, the parameters at level DEBUG.

Parameters:

- *methodName*: name of the method
- *params*: optional parameters to be logged; objects will be formatted as JSON

#### formatArgument(arg: any): string

Formats the given argument as a string:

- `string`: keep unchanged
- `number`, `Error`: formatted using `toString()``
- others: formatted as JSON

Parameters:

- *arg*: argument to be formnatted

Returns

- formatted argument

#### getInternalLogger(): log4javascript.Logger

Returns the internal Logger (for unit tests only).

Returns

- internally used log4javascript logger
