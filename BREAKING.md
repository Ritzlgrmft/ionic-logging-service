# Breaking Changes

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
