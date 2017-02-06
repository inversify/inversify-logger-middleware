# inversify-logger-middleware

[![Join the chat at https://gitter.im/inversify/InversifyJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/inversify/InversifyJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://secure.travis-ci.org/inversify/inversify-logger-middleware.svg?branch=master)](https://travis-ci.org/inversify/inversify-logger-middleware)
[![Test Coverage](https://codeclimate.com/github/inversify/inversify-logger-middleware/badges/coverage.svg)](https://codeclimate.com/github/inversify/inversify-logger-middleware/coverage)
[![npm version](https://badge.fury.io/js/inversify-logger-middleware.svg)](http://badge.fury.io/js/inversify-logger-middleware)
[![Dependencies](https://david-dm.org/inversify/inversify-logger-middleware.svg)](https://david-dm.org/inversify/inversify-logger-middleware#info=dependencies)
[![img](https://david-dm.org/inversify/inversify-logger-middleware/dev-status.svg)](https://david-dm.org/inversify/inversify-logger-middleware/#info=devDependencies)
[![img](https://david-dm.org/inversify/inversify-logger-middleware/peer-status.svg)](https://david-dm.org/inversify/inversify-logger-middleware/#info=peerDependenciess)
[![Known Vulnerabilities](https://snyk.io/test/github/inversify/inversify-logger-middleware/badge.svg)](https://snyk.io/test/github/inversify/inversify-logger-middleware)

[![NPM](https://nodei.co/npm/inversify-logger-middleware.png?downloads=true&downloadRank=true)](https://nodei.co/npm/inversify-logger-middleware/)
[![NPM](https://nodei.co/npm-dl/inversify-logger-middleware.png?months=9&height=3)](https://nodei.co/npm/inversify-logger-middleware/)

A console logger middleware for [InversifyJS](https://github.com/inversify/InversifyJS).

![](http://i.imgur.com/iFAogro.png)

## Installation

You can install `inversify-logger-middleware` using npm:

```sh
npm install inversify inversify-logger-middleware reflect-metadata --save
```

The `inversify-logger-middleware` type definitions are included in the npm module and require TypeScript 2.0.
Please refer to the [InversifyJS documentation](https://github.com/inversify/InversifyJS#installation) to learn more about the installation process.

### Motivation

Lets imagine that we have already configured an InversifyJS Container and the logger middleware using the fillowing bindings:

```ts
let module = new ContainerModule((bind: inversify.interfaces.Bind) => {
    bind<Weapon>("Weapon").to(Katana).whenInjectedInto(Samurai);
    bind<Weapon>("Weapon").to(Shuriken).whenInjectedInto(Ninja);
    bind<Warrior>("Warrior").to(Samurai).whenTargetTagged("canSneak", false);
    bind<Warrior>("Warrior").to(Ninja).whenTargetTagged("canSneak", true);
});
```

This middleware will display the InversifyJS resolution plan in console in the following format.

```ts
//  container.getTagged<Warrior>("Warrior", "canSneak", true);

SUCCESS: 0.41 ms.
    └── Request : 0
        └── serviceIdentifier : Warrior
        └── bindings
            └── Binding<Warrior> : 0
                └── type : Instance
                └── implementationType : Ninja
                └── scope : Transient
        └── target
            └── serviceIdentifier : Warrior
            └── name : undefined
            └── metadata
                └── Metadata : 0
                    └── key : canSneak
                    └── value : true
        └── childRequests
            └── Request : 0
                └── serviceIdentifier : Weapon
                └── bindings
                    └── Binding<Weapon> : 0
                        └── type : Instance
                        └── implementationType : Shuriken
                        └── scope : Transient
                └── target
                    └── serviceIdentifier : Weapon
                    └── name : shuriken
                    └── metadata
                        └── Metadata : 0
                            └── key : name
                            └── value : shuriken
                        └── Metadata : 1
                            └── key : inject
                            └── value : Weapon
```

You can configure which elements of the resolution plan are being desplayed.

This kind of information can help you during the development of applications with InersifyJS.

### Default settings and renderer

You can create a logger using the default settings as follows:

```ts
import { makeLoggerMiddleware } from 'inversify-logger-middleware';
let logger = makeLoggerMiddleware();
```

The default options are the following:

```ts
let deatultOptions: LoggerSettings = {
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
let options: LoggerSettings = {
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
let container = new Container();
let logger = makeLoggerMiddleware();
container.applyMiddleware(logger);
```

Please refere to the
[InversifyJS documentation](https://github.com/inversify/InversifyJS#middleware)
to learn more about middleware.

### Demo app

A sample application can be found at the
[inversify-code-samples](https://github.com/inversify/inversify-code-samples/tree/master/inversify-binding-decorators) repository.
