/**
 * inversify-logger-middleware v.1.0.0-alpha.1 - A basic logger middleware for InversifyJS
 * Copyright (c) 2015 Remo H. Jansen <remo.jansen@wolksoftware.com> (http://www.remojansen.com)
 * MIT inversify.io/LICENSE
 * https://github.com/inversify/inversify-logger-middleware#readme
 */
var dir = {
    a: "├──",
    b: "└──",
    c: "│",
    d: ""
};
var deatultOptions = {
    request: {
        bindings: {
            activated: false,
            cache: false,
            constraint: false,
            dynamicValue: false,
            factory: false,
            implementationType: false,
            onActivation: false,
            provider: false,
            scope: false,
            serviceIdentifier: false,
            type: false
        },
        result: false,
        serviceIdentifier: false,
        target: {
            metadata: false,
            name: false,
            serviceIdentifier: false
        }
    }
};
function consoleRenderer(out) {
    console.log(out);
}
function makeLoggerMiddleware(settings, renderer) {
    var logger = function (next) {
        return function (context) {
            if (settings === undefined) {
                settings = deatultOptions;
            }
            ;
            if (renderer === undefined) {
                renderer = consoleRenderer;
            }
            ;
            var result = next(context);
            console.log(dir);
            return result;
        };
    };
    return logger;
}
export default makeLoggerMiddleware;
