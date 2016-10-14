import { interfaces } from "inversify";
import { getIndentationForDepth, makePropertyLogger } from "./text_serializer_utils";
import bindingTypeFormatter from "../../formatters/binding_type_formatter";
import serviceIdentifierFormatter from "../../formatters/service_identifier_formatter";
import scopeFormatter from "../../formatters/scope_formatter";

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
                case "type":
                    val = bindingTypeFormatter(_b[prop]);
                    break;
                case "scope":
                    val = scopeFormatter(_b[prop]);
                    break;
                case "implementationType":
                    val = _b[prop] && _b[prop].name;
                    break;
                case "serviceIdentifier":
                    val = serviceIdentifierFormatter(_b[prop]);
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
