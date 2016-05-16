/// <reference path="./interfaces.d.ts" />

import deatultOptions from "./default_settings";
import consoleRenderer from "./default_renderer";
import { tree } from "./constants";
import getRequestLogEntry from "./request_logger";
import { getTime, getTimeDiference } from "./utils";

function makeLoggerMiddleware(settings?: ILoggerSettings, renderer?: (out: string) => void): inversify.IMiddleware {

    let logger = function (next: (context: inversify.IContext) => any) {
        return function (context: inversify.IContext) {

            if (settings === undefined || settings === null) { settings = deatultOptions; };
            if (renderer === undefined || renderer === null) { renderer = consoleRenderer; };

            let start =  getTime();
            let result = next(context);
            let end = getTime();
            let log = getRequestLogEntry(`${tree.item} plan\n`, settings, context.plan.rootRequest, 0, 0);

            if (settings.time) {
                log = `${log}\n Time: ${getTimeDiference(start, end)} millisecond/s.\n`;
            }

            renderer(log);
            return result;

        };
    };

    return logger;

}

export default makeLoggerMiddleware;
