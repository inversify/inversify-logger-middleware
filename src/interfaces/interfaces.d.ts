/// <reference path="../../node_modules/inversify-dts/inversify/inversify.d.ts" />
/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../../typings/index.d.ts" />

interface ILoggerSettings {
    request?: IRequestLoggerSettings;
    time?: boolean;
}

interface IRequestLoggerSettings {
    serviceIdentifier?: boolean;
    bindings?: IBindingLoggerSettings;
    target?: ITargetLoggerSettings;
}

interface IBindingLoggerSettings {
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

interface ITargetLoggerSettings {
    serviceIdentifier?: boolean;
    name?: boolean;
    metadata?: boolean;
}

interface ILogEntry {
    error: boolean;
    exception: any;
    rootRequest: any;
    time: string;
}
