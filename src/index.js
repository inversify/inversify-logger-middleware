"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = makeLoggerMiddleware;
