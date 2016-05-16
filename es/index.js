/**
 * inversify-logger-middleware v.1.0.0-alpha.1 - A basic logger middleware for InversifyJS
 * Copyright (c) 2015 Remo H. Jansen <remo.jansen@wolksoftware.com> (http://www.remojansen.com)
 * MIT inversify.io/LICENSE
 * https://github.com/inversify/inversify-logger-middleware#readme
 */
import deatultOptions from "./default_settings";
import consoleRenderer from "./default_renderer";
import { tree } from "./constants";
import getRequestLogEntry from "./request_logger";
import { getTime, getTimeDiference } from "./utils";
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
            var start = getTime();
            var result = next(context);
            var end = getTime();
            var log = getRequestLogEntry(tree.item + " plan\n", settings, context.plan.rootRequest, 0, 0);
            if (settings.time) {
                log = log + "\n Time: " + getTimeDiference(start, end) + " millisecond/s.\n";
            }
            renderer(log);
            return result;
        };
    };
    return logger;
}
export default makeLoggerMiddleware;
