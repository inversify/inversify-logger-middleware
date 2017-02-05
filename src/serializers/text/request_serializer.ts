import { interfaces, getServiceIdentifierAsString } from "inversify";
import { getIndentationForDepth, makePropertyLogger } from "./text_serializer_utils";
import serializeBinding from "./binding_serializer";
import serializeTarget from "./target_serializer";

function serializeRequest(textEntry: string, depth: number, index: number, request: interfaces.Request) {

    let indentation = getIndentationForDepth(depth);
    let propertyLogger = makePropertyLogger(indentation);

    textEntry = propertyLogger(textEntry, 0, "Request", index.toString());

    if (request !== null) {

        if (request.serviceIdentifier !== undefined) {
            textEntry = propertyLogger(
                textEntry, 1, "serviceIdentifier", getServiceIdentifierAsString(request.serviceIdentifier)
            );
        }

        // bindings
        if (request.bindings !== undefined && Array.isArray(request.bindings)) {
            textEntry = propertyLogger(textEntry, 1, "bindings");
            request.bindings.forEach((binding: interfaces.Binding<any>, bindingIndex: number) => {
                textEntry = propertyLogger(
                    textEntry, 2, `Binding<${getServiceIdentifierAsString(request.serviceIdentifier)}>`, bindingIndex.toString()
                );
                textEntry = serializeBinding(textEntry, depth, binding);
            });
        }

        // target
        textEntry = serializeTarget(textEntry, depth, request.target);

        // child requests
        if (request.childRequests !== undefined && Array.isArray(request.childRequests) && request.childRequests.length > 0) {
            textEntry = propertyLogger(textEntry, 1, "childRequests");
            request.childRequests.forEach((childRequest: interfaces.Request, childIndex: number) => {
                textEntry = serializeRequest(textEntry, (depth + 2), childIndex, childRequest);
            });
        }

    }

    return textEntry;
}

export default serializeRequest;
