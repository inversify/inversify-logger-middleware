import { interfaces, getServiceIdentifierAsString } from "inversify";
import { getIndentationForDepth, makePropertyLogger } from "./text_serializer_utils";

function serializeBinding(
    textEntry: string, depth: number, binding: interfaces.Binding<any>
) {

    let indentation = getIndentationForDepth(depth);
    let propertyLogger = makePropertyLogger(indentation);

    let props = [
        "type", "serviceIdentifier", "implementationType",
        "activated", "cache", "constraint", "dynamicValue",
        "factory", "onActivation", "provider", "scope"
    ];

    let _b: any = binding;

    props.forEach((prop) => {
        if (_b[prop] !== undefined) {
            let val: any = _b[prop];
            switch (prop) {
                case "implementationType":
                    val = _b[prop] && _b[prop].name;
                    break;
                case "serviceIdentifier":
                    val = getServiceIdentifierAsString(_b[prop]);
                    break;
                default:
                    val = _b[prop];
            }
            textEntry = propertyLogger(textEntry, 3, prop, val);
        }
    });

    return textEntry;
}

export default serializeBinding;
