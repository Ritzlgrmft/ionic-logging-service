# Breaking Changes

## Version 11

- update to Angular 10

## Version 10

### ionic-logging-service

- logMessagesChanged does no longer emit the last added message

### ionic-logging-viewer

- LoggingViewerModal component provides now by default a delete button for deleting the existing messages.
  The button can be hidden using the `allowClearLogs` parameter.

## Version 9

- update to Angular 9

## Version 8

- update to Angular 8

## Version 7

- update to Angular 7

## Version 6

With version 6, these breaking changes were introduced:

- update to Angular 6 (instead of 5)
- no usage of [ionic-configuration-service](https://github.com/Ritzlgrmft/ionic-configuration-service) any more
- import of `LoggingServiceModule`

### Migration of the configuration

- move logging configuration from `src/assets/settings.json` to `environments/environment.ts`
- import of `LoggingServiceModule`
- load configuration in your `AppModule`
