/// <reference path="./interfaces.d.ts" />

import { tree, indentation } from "./constants";
import { getIndentationForDepth } from "./utils";
import getBindingLogEntry from "./binding_logger";
import getTargetLogEntry from "./target_logger";
import { cyan } from "./utils";

function getRequestLogEntry(
    log: string,
    options: ILoggerSettings,
    request: inversify.IRequest,
    depth: number,
    index: number
): string {

    let indentationForDepth = getIndentationForDepth(depth);

    log = `${log}${indentationForDepth}${tree.item} ${cyan("item")}:${index}\n`;

    if (options.request.serviceIdentifier === true) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("serviceIdentifier")}: ${request.serviceIdentifier}\n`;
    }

    // bindings
    if (options.request.bindings !== undefined) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("bindings")}:\n`;
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
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("childRequests")}:\n`;
    }

    request.childRequests.forEach((childRequest, i) => {
        log = getRequestLogEntry(log, options, childRequest, (depth + 2), i);
    });

    return log;

}

export default getRequestLogEntry;
