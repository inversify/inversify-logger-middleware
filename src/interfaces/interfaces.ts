/// <reference path="../../node_modules/inversify-dts/inversify/inversify.d.ts" />
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../../typings/index.d.ts" />

namespace interfaces {

    export interface LoggerSettings {
        request?: RequestLoggerSettings;
        time?: boolean;
    }

    export interface RequestLoggerSettings {
        serviceIdentifier?: boolean;
        bindings?: BindingLoggerSettings;
        target?: TargetLoggerSettings;
    }

    export interface BindingLoggerSettings {
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

    export interface TargetLoggerSettings {
        serviceIdentifier?: boolean;
        name?: boolean;
        metadata?: boolean;
    }

    export interface LogEntry {
        error: boolean;
        exception: any;
        multiInject: boolean;
        results: any[];
        rootRequest: inversify.interfaces.Request;
        serviceIdentifier: any;
        target: any;
        time: string;
    }

}

export default interfaces;
