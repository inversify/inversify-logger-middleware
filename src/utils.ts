/// <reference path="./interfaces.d.ts" />

import { tree, indentation } from "./constants";
import * as chalk from "chalk";

let cyan = chalk.cyan;
let yellow  = chalk.yellow;

declare var process: any;
declare var window: any;

function getIndentationForDepth(depth: number) {
    let indentationForDepth = indentation;
    for (let i = depth; i--; i >= 0) {
        indentationForDepth = `${indentationForDepth}${indentation}`;
    }
    return indentationForDepth;
}

function getTime() {

    if (typeof window !== "undefined") {

        // modern browsers
        return window.performance.now();

    } else if (typeof process !== "undefined") {

        // node
        let nanoseconds = process.hrtime()[1];
        let milliseconds = nanoseconds / 1000000;
        return milliseconds;

    } else {

        // old browsers
        return new Date().getTime();

    }

}

function getTimeDiference( start: number, end: number) {
    let diff = end - start;
    let formatted = diff.toFixed(2);
    return formatted;
}

function makePropertyLogger(indentationForDepth: string) {
    return function (log: string, tabCount: number, key: string, value?: any) {

        let line = `${log}${indentationForDepth}`;

        for (let i = tabCount; i > 0; i--) {
            line = `${line}${indentation}`;
        }

        line = `${line}${tree.item} ${cyan(key)}`;

        if (value !== undefined) {
            line = `${line} : ${yellow(value.toString())}`;
        }

        return `${line}\n`;
    };
}

export { getIndentationForDepth, getTime, getTimeDiference, makePropertyLogger };
