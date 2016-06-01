import deatultOptions from "./config/default_settings";
import consoleRenderer from "./renderers/console_renderer";
import requestReducer from "./reducers/request_reducer";
import textSerializer from "./serializers/text/text_serializer";
import { getTime, getTimeDiference } from "./utils/utils";

function makeLoggerMiddleware(settings?: ILoggerSettings, renderer?: (out: ILogEntry) => void): inversify.IMiddleware {
    let logger = function (planAndResolve: inversify.PlanAndResolve<any>): inversify.PlanAndResolve<any> {
        return (args: inversify.PlanAndResolveArgs) => {

            if (settings === undefined || settings === null) { settings = deatultOptions; };
            if (renderer === undefined || renderer === null) { renderer = consoleRenderer; };

            let results: any = null;

            let logEntry: ILogEntry = {
                error: false,
                exception: null,
                multiInject: args.multiInject,
                requests: [],
                results: [],
                serviceIdentifier: args.serviceIdentifier,
                target: args.target,
                time: null
            };

            let nextContextInterceptor = args.contextInterceptor;
            args.contextInterceptor = (context: inversify.IContext) => {
                logEntry.requests.push(requestReducer(context.plan.rootRequest, settings.request));
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
            return results;

        };
    };

    return logger;

}

export { makeLoggerMiddleware, textSerializer };
