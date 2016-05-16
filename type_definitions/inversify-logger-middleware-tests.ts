/// <reference path="./inversify-logger-middleware.d.ts" />
/// <reference path="../node_modules/inversify/type_definitions/inversify/inversify.d.ts" />
/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />

declare var kernel: inversify.IKernel;

import makeLoggerMiddleware from "inversify-logger-middleware";

let makeStringRenderer = function (loggerOutput: { content: string }) {
    return function (out: string) {
        loggerOutput.content = out;
    };
};

let options: inversifyLoggerMiddleware.ILoggerSettings = {
    request: {
        bindings: {
            activated: true,
            cache: true,
            constraint: true,
            dynamicValue: true,
            factory: true,
            implementationType: true,
            onActivation: true,
            provider: true,
            scope: true,
            serviceIdentifier: true,
            type: true
        },
        serviceIdentifier: true,
        target: {
            metadata: true,
            name: true,
            serviceIdentifier: true
        }
    },
    time: true
};

let loggerOutput = { content: "" };
let stringRenderer = makeStringRenderer(loggerOutput);
let logger = makeLoggerMiddleware(options, stringRenderer);
kernel.applyMiddleware(logger);
