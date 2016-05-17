// Type definitions for inversify 1.0.0-beta.1
// Project: https://github.com/inversify/inversify-logger-middleware
// Definitions by: inversify <https://github.com/inversify/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare namespace inversifyLoggerMiddleware {

    export interface ILoggerSettings {
        request?: IRequestLogger;
        time?: boolean;
    }

    export interface IRequestLogger {
        serviceIdentifier?: boolean;
        bindings?: IBindingLogger;
        target?: ITargetLogger;
    }

    export interface IBindingLogger {
        activated?: boolean;
        serviceIdentifier?: boolean;
        implementationType?: boolean;
        factory?: boolean;
        provider?: boolean;
        constraint?: boolean;
        onActivation?: boolean;
        cache?: boolean;
        dynamicValue?: boolean;
        scope?: boolean;
        type?: boolean;
    }

    export interface ITargetLogger {
        serviceIdentifier?: boolean;
        name?: boolean;
        metadata?: boolean;
    }

    export default function makeLoggerMiddleware(settings?: ILoggerSettings, renderer?: (out: string) => void):
        (next: (context: any) => any) => (context: any) => any;

}

declare module "inversify-logger-middleware" {
  export = inversifyLoggerMiddleware;
}
