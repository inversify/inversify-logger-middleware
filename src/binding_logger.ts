/// <reference path="./interfaces.d.ts" />

import { tree, indentation } from "./constants";

function getBindingLogEntry(
    log: string,
    options: ILoggerSettings,
    index: number,
    binding: inversify.IBinding<any>,
    indentationForDepth: string
) {

    log = `${log}${indentationForDepth}${tree.item} item:${index}\n`;

    if (options.request.bindings.activated) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} activated: ${binding.activated}\n`;
    }

    if (options.request.bindings.cache) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} cache: ${binding.cache}\n`;
    }

    if (options.request.bindings.constraint) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} constraint: ${binding.constraint}\n`;
    }

    if (options.request.bindings.dynamicValue) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} dynamicValue: ${binding.dynamicValue}\n`;
    }

    if (options.request.bindings.factory) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} factory: ${binding.factory}\n`;
    }

    if (options.request.bindings.implementationType) {
        let name = (binding.implementationType) ? (<any>binding.implementationType).name : undefined;
        log = `${log}${indentationForDepth}${indentation}${tree.item} implementationType: ${name}\n`;
    }

    if (options.request.bindings.onActivation) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} onActivation: ${binding.onActivation}\n`;
    }

    if (options.request.bindings.provider) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} provider: ${binding.provider}\n`;
    }

    if (options.request.bindings.scope) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} scope: ${binding.scope}\n`;
    }

    if (options.request.bindings.serviceIdentifier) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} serviceIdentifier: ${binding.serviceIdentifier}\n`;
    }

    if (options.request.bindings.type) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} type: ${binding.type}\n`;
    }

    return log;

}

export default getBindingLogEntry;
