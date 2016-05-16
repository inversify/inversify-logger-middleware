# inversify-logger-middleware

[![Join the chat at https://gitter.im/inversify/InversifyJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/inversify/InversifyJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://secure.travis-ci.org/inversify/inversify-logger-middleware.svg?branch=master)](https://travis-ci.org/inversify/inversify-logger-middleware)
[![codecov.io](https://codecov.io/github/inversify/inversify-logger-middleware/coverage.svg?branch=master)](https://codecov.io/github/inversify/inversify-logger-middleware?branch=master)
[![npm version](https://badge.fury.io/js/inversify-logger-middleware.svg)](http://badge.fury.io/js/inversify-logger-middleware)
[![Dependencies](https://david-dm.org/inversify/inversify-logger-middleware.svg)](https://david-dm.org/inversify/inversify-logger-middleware#info=dependencies)
[![img](https://david-dm.org/inversify/inversify-logger-middleware/dev-status.svg)](https://david-dm.org/inversify/inversify-logger-middleware/#info=devDependencies)
[![img](https://david-dm.org/inversify/inversify-logger-middleware/peer-status.svg)](https://david-dm.org/inversify/inversify-logger-middleware/#info=peerDependenciess)
[![Known Vulnerabilities](https://snyk.io/test/github/inversify/inversify-logger-middleware/badge.svg)](https://snyk.io/test/github/inversify/inversify-logger-middleware)

[![NPM](https://nodei.co/npm/inversify-logger-middleware.png?downloads=true&downloadRank=true)](https://nodei.co/npm/inversify-logger-middleware/)
[![NPM](https://nodei.co/npm-dl/inversify-logger-middleware.png?months=9&height=3)](https://nodei.co/npm/inversify-logger-middleware/)

A console logger middleware for InversifyJS

**Coming soon! Please [contact us on Gitter](https://gitter.im/inversify/InversifyJS) If you would like to help us to develop one of the [official InversifyJS projects](https://github.com/inversify).**

### Installation
You can install `inversify-logger-middleware` using npm:
```
$ npm install inversify-logger-middleware
```
if you are workiong with TypeScript you will need the following .d.ts files:

/// <reference path="node_modules/inversify-logger-middleware/type_definitions/inversify-logger-middleware.d.ts" />
/// <reference path="node_modules/reflect-metadata/reflect-metadata.d.ts" />

### Motivation
Lets imagine that we have already configured an InversifyJS Kernel and the logger middleware using the fillowing bindings:
```ts
kernel.bind<IWeapon>("IWeapon").to(Katana).whenInjectedInto(Samurai);
kernel.bind<IWeapon>("IWeapon").to(Shuriken).whenInjectedInto(Ninja);
kernel.bind<IWarrior>("IWarrior").to(Samurai).whenTargetTagged("canSneak", false);
kernel.bind<IWarrior>("IWarrior").to(Ninja).whenTargetTagged("canSneak", true);
```
This middleware will display the InversifyJS resolution plan in console in the following format.

```ts
// kernel.getTagged<IWarrior>("IWarrior", "canSneak", false);

└── plan
    └── item : 0
        └── serviceIdentifier : IWarrior
        └── bindings
            └── item : 0
                └── type : Instance
                └── serviceIdentifier : IWarrior
                └── implementationType : Samurai
                └── activated : false
                └── cache : null
                └── dynamicValue : null
                └── factory : null
                └── onActivation : null
                └── provider : null
                └── scope : Transient
        └── target
            └── name : undefined
            └── serviceIdentifier : IWarrior
            └── metadata
                └── item : 0
                    └── key : canSneak
                    └── value : false
        └── childRequests
            └── item : 0
                └── serviceIdentifier : IWeapon
                └── bindings
                    └── item : 0
                        └── type : Instance
                        └── serviceIdentifier : IWeapon
                        └── implementationType : Katana
                        └── activated : false
                        └── cache : null
                        └── dynamicValue : null
                        └── factory : null
                        └── onActivation : null
                        └── provider : null
                        └── scope : Transient
                └── target
                    └── name : katana
                    └── serviceIdentifier : IWeapon
                    └── metadata
                        └── item : 0
                            └── key : name
                            └── value : katana
                        └── item : 1
                            └── key : inject
                            └── value : IWeapon

 Time: 0.08 millisecond/s.
```

You can configure which elements of the resolution plan are being desplayed.

This kind of information can help you during the development of applications with InersifyJS.

### Default settings and renderer
You can create a logger using the default settings as follows:

```ts
let logger = makeLoggerMiddleware();
```

The default options are the following:

```ts
let deatultOptions: ILoggerSettings = {
    request: {
        bindings: {
            activated: false,
            cache: false,
            constraint: false,
            dynamicValue: false,
            factory: false,
            implementationType: true,
            onActivation: false,
            provider: false,
            scope: false,
            serviceIdentifier: false,
            type: false
        },
        serviceIdentifier: true,
        target: {
            metadata: true,
            name: false,
            serviceIdentifier: false
        }
    },
    time: true
};
```

You can use the option to determine which elements of the resolution plan should be logged.

The default renderer look as follows:

```ts
function consoleRenderer(out: string) {
    console.log(out);
}
```

### Custom settings and renderer

The following code snippet uses custom settings and a string renderer instead of the default console renderer.

```ts
let options: ILoggerSettings = {
    request: {
        serviceIdentifier: true,
        bindings: {
            scope: true
        },
        result: true
    }
};

// Takes object (loggerOutput) instead of primitive (string) to share reference
let makeStringRenderer = function (loggerOutput: { content: string }) {
    return function (out: string) {
        loggerOutput.content = out;
    };
};


let loggerOutput = { content : "" };
let stringRenderer = makeStringRenderer(loggerOutput);
let logger = makeLoggerMiddleware(null, stringRenderer);
```

### Applying the middleware

You can apply the logger middlerare using the InversifyJS API:

```ts
let kernel = new Kernel();
let logger = makeLoggerMiddleware();
kernel.applyMiddleware(logger);
```

Please refere to the 
[InversifyJS documentation](https://github.com/inversify/InversifyJS#middleware) 
to learn more about middleware.
