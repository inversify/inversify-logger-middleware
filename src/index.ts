import deatultOptions from "./config/default_settings";
import consoleRenderer from "./renderers/console_renderer";
import requestReducer from "./reducers/request_reducer";
import textSerializer from "./serializers/text/text_serializer";
import { getTime, getTimeDiference } from "./utils/utils";

function makeLoggerMiddleware(settings?: ILoggerSettings, renderer?: (out: ILogEntry) => void): inversify.IMiddleware {

    let logger = function (next: (context: inversify.IContext) => any) {
        return function (context: inversify.IContext) {

            if (settings === undefined || settings === null) { settings = deatultOptions; };
            if (renderer === undefined || renderer === null) { renderer = consoleRenderer; };
            let result: any = null;

            let logEntry: ILogEntry = {
                error: null,
                exception: null,
                rootRequest: null,
                time: null
            };

            try {
                let start =  getTime();
                result = next(context);
                let end = getTime();
                logEntry = {
                    error: false,
                    exception: null,
                    rootRequest: requestReducer(context.plan.rootRequest, settings.request),
                    time: (settings.time) ? getTimeDiference(start, end) : null
                };
            } catch (e) {
                logEntry = {
                    error: true,
                    exception: e,
                    rootRequest: requestReducer(context.plan.rootRequest, settings.request),
                    time: null
                };
            }

            renderer(logEntry);
            return result;

        };
    };

    return logger;

}

export { makeLoggerMiddleware, textSerializer };
