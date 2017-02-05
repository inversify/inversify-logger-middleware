import { interfaces, getServiceIdentifierAsString } from "inversify";
import serializeMetadata from "./metadata_serializer";
import { getIndentationForDepth, makePropertyLogger } from "./text_serializer_utils";

function serializeTarget(textEntry: string, depth: number, target: interfaces.Target) {

    let indentation = getIndentationForDepth(depth);
    let propertyLogger = makePropertyLogger(indentation);

    if (target !== undefined) {

        textEntry = propertyLogger(textEntry, 1, "target");

        if (target.serviceIdentifier !== undefined) {
            textEntry = propertyLogger(
                textEntry, 2, "serviceIdentifier", getServiceIdentifierAsString(target.serviceIdentifier)
            );
        }

        if (target.name !== undefined) {
            textEntry = propertyLogger(textEntry, 2, "name", (target.name.value() || "undefined"));
        }

        textEntry = serializeMetadata(textEntry, depth, target.metadata);

    }

    return textEntry;
}

export default serializeTarget;
