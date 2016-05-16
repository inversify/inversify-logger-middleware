/// <reference path="./interfaces.d.ts" />

import { tree, indentation } from "./constants";
import { cyan } from "./utils";

function getBindingLogEntry(
    log: string,
    options: ILoggerSettings,
    index: number,
    binding: inversify.IBinding<any>,
    indentationForDepth: string
) {

    log = `${log}${indentationForDepth}${tree.item} ${cyan("item")}:${index}\n`;

    if (options.request.bindings.activated) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("activated")}: ${binding.activated}\n`;
    }

    if (options.request.bindings.cache) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("cache")}: ${binding.cache}\n`;
    }

    if (options.request.bindings.constraint) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("constraint")}: ${binding.constraint}\n`;
    }

    if (options.request.bindings.dynamicValue) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("dynamicValue")}: ${binding.dynamicValue}\n`;
    }

    if (options.request.bindings.factory) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("factory")}: ${binding.factory}\n`;
    }

    if (options.request.bindings.implementationType) {
        let name = (binding.implementationType) ? (<any>binding.implementationType).name : undefined;
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("implementationType")}: ${name}\n`;
    }

    if (options.request.bindings.onActivation) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("onActivation")}: ${binding.onActivation}\n`;
    }

    if (options.request.bindings.provider) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("provider")}: ${binding.provider}\n`;
    }

    if (options.request.bindings.scope) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("scope")}: ${binding.scope}\n`;
    }

    if (options.request.bindings.serviceIdentifier) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("serviceIdentifier")}: ${binding.serviceIdentifier}\n`;
    }

    if (options.request.bindings.type) {
        log = `${log}${indentationForDepth}${indentation}${tree.item} ${cyan("type")}: ${binding.type}\n`;
    }

    return log;

}

export default getBindingLogEntry;
