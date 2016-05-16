/// <reference path="./interfaces.d.ts" />

import { makePropertyLogger } from "./utils";

function scopeToString(scope: number) {
    switch (scope) {
        case 1:
            return "Singleton";
        case 0:
        default:
            return "Transient";
    }
}

function bindingTypeToString(type: number) {
    switch (type) {
        case 1:
            return "Instance";
        case 2:
            return "ConstantValue";
        case 3:
            return "DynamicValue";
        case 4:
            return "Constructor";
        case 5:
            return "Factory";
        case 6:
            return "Provider";
        case 0:
        default:
            return "Invalid";
    }
}

function getBindingLogEntry(
    log: string,
    options: ILoggerSettings,
    index: number,
    binding: inversify.IBinding<any>,
    indentationForDepth: string
) {

    let logProperty = makePropertyLogger(indentationForDepth);

    log = logProperty(log, 0, "item", index);

    let props = [
        "type", "serviceIdentifier", "implementationType",
        "activated", "cache", "constraint", "dynamicValue",
        "factory", "onActivation", "provider", "scope"
    ];

    props.forEach((prop) => {

        let _bindings: any = options.request.bindings;
        let _binding: any = binding;

        if (_bindings[prop]) {

            let value = _binding[prop];

            switch (prop) {
                case "scope":
                    value = scopeToString(_binding[prop]);
                    break;
                 case "type":
                    value = bindingTypeToString(_binding[prop]);
                    break;
                 case "implementationType":
                    value = (_binding[prop].name || "undefined");
                    break;
                default:
                    value = _binding[prop];
                    break;
            }

            value = (value === null || value === undefined) ? "null" : value;
            log = logProperty(log, 1, prop, value);
        }
    });

    return log;

}

export default getBindingLogEntry;
