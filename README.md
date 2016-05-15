# inversify-logger-middleware
A console logger middleware for InversifyJS

**Coming soon! Please [contact us on Gitter](https://gitter.im/inversify/InversifyJS) If you would like to help us to develop one of the [official InversifyJS projects](https://github.com/inversify).**

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
            implementationType: false,
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
        },
        result: true
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