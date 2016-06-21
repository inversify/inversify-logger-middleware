import deatultOptions from "./config/default_settings";
import consoleRenderer from "./renderers/console_renderer";
import requestReducer from "./reducers/request_reducer";
import textSerializer from "./serializers/text/text_serializer";
import interfaces from "./interfaces/interfaces";
import { getTime, getTimeDiference } from "./utils/utils";

function makeLoggerMiddleware(
    settings?: interfaces.LoggerSettings,
    renderer?: (out: interfaces.LogEntry) => void
): inversify.interfaces.Middleware {

    let logger = function (
        planAndResolve: inversify.interfaces.PlanAndResolve<any>
    ): inversify.interfaces.PlanAndResolve<any> {

        return (args: inversify.interfaces.PlanAndResolveArgs) => {

            if (settings === undefined || settings === null) { settings = deatultOptions; };
            if (renderer === undefined || renderer === null) { renderer = consoleRenderer; };

            let results: any = null;

            let logEntry: interfaces.LogEntry = {
                error: false,
                exception: null,
                multiInject: args.multiInject,
                results: [],
                rootRequest: null,
                serviceIdentifier: args.serviceIdentifier,
                target: args.target,
                time: null
            };

            let nextContextInterceptor = args.contextInterceptor;
            args.contextInterceptor = (context: inversify.interfaces.Context) => {
                logEntry.rootRequest = requestReducer(context.plan.rootRequest, settings.request);
                return nextContextInterceptor(context);
            };

            try {
                let start =  getTime();
                results = planAndResolve(args);
                let end = getTime();
                logEntry.results = results;
                logEntry.time = (settings.time) ? getTimeDiference(start, end) : null;
            } catch (e) {
                logEntry.error = true;
                logEntry.exception = e;
                logEntry.time = null;
            }

            renderer(logEntry);
            return results || [];

        };
    };

    return logger;

}

export { makeLoggerMiddleware, textSerializer };
