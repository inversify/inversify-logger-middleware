/// <reference path="./interfaces.d.ts" />

import { makePropertyLogger } from "./utils";

function getTargetLogEntry(
    log: string,
    options: ILoggerSettings,
    target: inversify.ITarget,
    indentationForDepth: string
) {

    let logProperty = makePropertyLogger(indentationForDepth);

    log = logProperty(log, 0, "target");

    if (options.request.target.name) {
        log = logProperty(log, 1, "name", (target.name.value() || "undefined"));
    }

    if (options.request.target.serviceIdentifier) {
        log = logProperty(log, 1, "serviceIdentifier", target.serviceIdentifier);
    }

    if (options.request.target.metadata) {
        log = logProperty(log, 1, "metadata");
        target.metadata.forEach((m: inversify.IMetadata, i: number) => {
            log = logProperty(log, 2, "item", i);
            log = logProperty(log, 3, "key", m.key);
            log = logProperty(log, 3, "value", m.value);
        });
    }

    return log;

}

export default getTargetLogEntry;
