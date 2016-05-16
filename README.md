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
// kernel.getTagged<IWarrior>("IWarrior", "canSneak", true);

└── plan
    └── item : 0
        └── serviceIdentifier : IWarrior
        └── bindings
            └── item : 0
                └── type : Instance
                └── serviceIdentifier : IWarrior
                └── implementationType : Ninja
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
                    └── value : true
        └── childRequests
            └── item : 0
                └── serviceIdentifier : IWeapon
                └── bindings
                    └── item : 0
                        └── type : Instance
                        └── serviceIdentifier : IWeapon
                        └── implementationType : Shuriken
                        └── activated : false
                        └── cache : null
                        └── dynamicValue : null
                        └── factory : null
                        └── onActivation : null
                        └── provider : null
                        └── scope : Transient
                └── target
                    └── name : shuriken
                    └── serviceIdentifier : IWeapon
                    └── metadata
                        └── item : 0
                            └── key : name
                            └── value : shuriken
                        └── item : 1
                            └── key : inject
                            └── value : IWeapon

 Time: 0.37 millisecond/s.
```
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
        serviceIdentifier: true,
        bindings: {
            activated: false,
            serviceIdentifier: false,
            implementationType: true,
            factory: false,
            provider: false,
            constraint: false,
            onActivation: false,
            cache: false,
            dynamicValue: false,
            scope: false,
            type: false
        },
        target: {
            serviceIdentifier: false,
            name: false,
            metadata: false,
        }
    }
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

let makeStringRenderer = function (str: string) {
    return function (out: string) {
        str = out;
    };
}

let output = "";
let stringRenderer = makeStringRenderer(output);

let logger = makeLoggerMiddleware(options, stringRenderer);
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
