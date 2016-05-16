/// <reference path="./interfaces.d.ts" />

import { tree, indentation } from "./constants";
import { cyan } from "./utils";

function getTargetLogEntry(
    log: string,
    options: ILoggerSettings,
    target: inversify.ITarget,
    indentationForDepth: string
) {

    log = `${log}${indentationForDepth}${tree.item} target\n`;

    if (options.request.target.name) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} name: ${target.name.value() || "undefined"}\n`;
    }

    if (options.request.target.serviceIdentifier) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} serviceIdentifier: ${target.serviceIdentifier}\n`;
    }

    if (options.request.target.metadata) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("metadata")}\n`;
        target.metadata.forEach((m: inversify.IMetadata, i: number) => {
            log = `${log}${indentationForDepth}${indentation}${indentation}${tree.item} item:${i}\n`;
            log = `${log}${indentationForDepth}${indentation}${indentation}${indentation}${tree.item} key: ${m.key}\n`;
            log = `${log}${indentationForDepth}${indentation}${indentation}${indentation}${tree.item} value: ${m.value}\n`;
        });
    }

    return log;

}

export default getTargetLogEntry;
