/// <reference path="./interfaces.d.ts" />

let deatultOptions: ILoggerSettings = {
    request: {
        bindings: {
            activated: true,
            cache: true,
            constraint: false,
            dynamicValue: true,
            factory: true,
            implementationType: true,
            onActivation: true,
            provider: true,
            scope: true,
            serviceIdentifier: true,
            type: true
        },
        serviceIdentifier: true,
        target: {
            metadata: true,
            name: true,
            serviceIdentifier: true
        }
    },
    time: true,
};

export default deatultOptions;
