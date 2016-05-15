/// <reference path="../src/interfaces.d.ts" />

import makeLoggerMiddleware from "../src/index";

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