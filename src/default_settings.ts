/// <reference path="./interfaces.d.ts" />

let deatultOptions: ILoggerSettings = {
    request: {
        bindings: {
            activated: false,
            cache: false,
            constraint: false,
            dynamicValue: false,
            factory: false,
            implementationType: true,
            onActivation: false,
            provider: false,
            scope: false,
            serviceIdentifier: false,
            type: false
        },
        serviceIdentifier: true,
        target: {
            metadata: true,
            name: false,
            serviceIdentifier: false
        }
    },
    time: true
};

export default deatultOptions;
