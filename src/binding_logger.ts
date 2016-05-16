/// <reference path="./interfaces.d.ts" />

import { makePropertyLogger } from "./utils";

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
            let value = (prop === "implementationType") ? (_binding[prop].name || undefined) : _binding[prop];
            value = (value === null || value === undefined) ? "null" : value;
            log = logProperty(log, 1, prop, value);
        }
    });

    return log;

}

export default getBindingLogEntry;
