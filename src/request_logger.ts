/// <reference path="./interfaces.d.ts" />

import { indentation } from "./constants";
import { getIndentationForDepth } from "./utils";
import getBindingLogEntry from "./binding_logger";
import getTargetLogEntry from "./target_logger";
import { makePropertyLogger } from "./utils";

function getRequestLogEntry(
    log: string,
    options: ILoggerSettings,
    request: inversify.IRequest,
    depth: number,
    index: number
): string {

    let indentationForDepth = getIndentationForDepth(depth);
    let logProperty = makePropertyLogger(indentationForDepth);

    log = logProperty(log, 0, "item", index);

    if (options.request.serviceIdentifier === true) {
        log = logProperty(log, 1, "serviceIdentifier", request.serviceIdentifier);
    }

    // bindings
    if (options.request.bindings !== undefined) {
        log = logProperty(log, 1, "bindings");
        request.bindings.forEach((binding: inversify.IBinding<any>, i: number) => {
            log = getBindingLogEntry(log, options, i, binding, `${indentationForDepth}${indentation}${indentation}`);
        });
    }

    // target
    if (options.request.target !== undefined) {
        log = getTargetLogEntry(log, options, request.target, `${indentationForDepth}${indentation}`);
    }

    // child requests
    if (request.childRequests.length > 0) {
        log = logProperty(log, 1, "childRequests");
    }

    request.childRequests.forEach((childRequest, i) => {
        log = getRequestLogEntry(log, options, childRequest, (depth + 2), i);
    });

    return log;

}

export default getRequestLogEntry;
