import { yellow } from "./colors";

let tree = {
    item: "└──"
};

let indentationStr  = "    ";

function getIndentationForDepth(depth: number) {
    let indentationForDepth = indentationStr;
    for (let i = depth; i--; i > 0) {
        indentationForDepth = `${indentationForDepth}${indentationStr}`;
    }
    return indentationForDepth;
}

function makePropertyLogger(indentationForDepth: string) {
    return function (textEntry: string, tabCount: number, key: string, value?: any) {

        let line = `${textEntry}${indentationForDepth}`;

        for (let i = tabCount; i > 0; i--) {
            line = `${line}${indentationStr}`;
        }

        line = `${line}${tree.item} ${key}`;

        if (value !== undefined) {
            if (typeof value !== "boolean") {
                let val = value ? value.toString().split("\n").join("") : "null";
                line = `${line} : ${yellow(val)}`;
            } else {
                line = `${line} : ${yellow(value.toString())}`;
            }
        }

        return `${line}\n`;
    };
}

export { getIndentationForDepth, makePropertyLogger };
