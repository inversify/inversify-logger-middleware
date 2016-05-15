/// <reference path="../node_modules/inversify/type_definitions/inversify/inversify.d.ts" />
/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../typings/main.d.ts" />

interface ILoggerSettings {
    request: IRequestLogger,
}

interface IRequestLogger {
    serviceIdentifier?: boolean,
    bindings?: IBindingLogger,
    target?: ITargetLogger,
    result?: boolean
}

interface IBindingLogger {
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

interface ITargetLogger {
    serviceIdentifier?: boolean;
    name?: boolean;
    metadata?: boolean;
}
