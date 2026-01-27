# ToDos

There is a compatibility issue between Ionic 8.7.16, Angular 21, and Vitest 4 in ES module environments. The @ionic/angular package is attempting a directory import from @ionic/core/components, which isn't supported in strict ES modules.

This will be fixed (hopefully) in Ionic 8.8.

This is the error message:

```plain
Error: Directory import '/Users/markus/Development/Ritzlgrmft/ionic-logging-service/node_modules/@ionic/core/components' is not supported resolving ES modules imported from /Users/markus/Development/Ritzlgrmft/ionic-logging-service/node_modules/@ionic/angular/fesm2022/ionic-angular-common.mjs
Did you mean to import "@ionic/core/components/index.js"?
```

-----------

- backend sample
- make additivity configurable
- ajaxAppender: add device info (#8)
- ajaxAppender: Batch log statements until either the batch size is exceeded or a timeout threshold is exceeded (#7)
- ajaxAppender: enable/disable by code (#9)
