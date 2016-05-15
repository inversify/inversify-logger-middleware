/// <reference path="./interfaces.d.ts" />

let dir = {
    a: "├──",
    b: "└──",
    c: "│",
    d: ""
};

let deatultOptions: ILoggerSettings = {
    request: {
        serviceIdentifier: false,
        bindings: {
            activated: false,
            serviceIdentifier: false,
            implementationType: false,
            factory: false,
            provider: false,
            constraint: false,
            onActivation: false,
            cache: false,
            dynamicValue: false,
            scope: false,
            type: false
        },
        target: {
            serviceIdentifier: false,
            name: false,
            metadata: false,
        },
        result: false
    }
};

function consoleRenderer(out: string) {
    console.log(out);
}

function makeLoggerMiddleware(settings?: ILoggerSettings, renderer?: (out: string) => void) {

    let logger = function (next: (context: inversify.IContext) => any) {
        return function (context: inversify.IContext) {
            
            if (settings === undefined) settings = deatultOptions;
            if (renderer === undefined) renderer = consoleRenderer;
            
            let result = next(context);
            console.log()
            return result;

        };
    };
    
    return logger;

}

export default makeLoggerMiddleware;
