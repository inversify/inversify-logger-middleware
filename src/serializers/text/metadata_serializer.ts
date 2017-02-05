import { interfaces, getServiceIdentifierAsString } from "inversify";
import { getIndentationForDepth, makePropertyLogger } from "./text_serializer_utils";

function serializeMetadata(textEntry: string, depth: number, tags: interfaces.Metadata[]) {

    let indentation = getIndentationForDepth(depth);
    let propertyLogger = makePropertyLogger(indentation);

    if (tags && Array.isArray(tags)) {
        textEntry = propertyLogger(textEntry, 2, "metadata");
        tags.forEach((metadata: interfaces.Metadata, index: number) => {
            textEntry = propertyLogger(textEntry, 3, "Metadata", index.toString());
            textEntry = propertyLogger(textEntry, 4, "key", metadata.key);
            textEntry = propertyLogger(textEntry, 4, "value", getServiceIdentifierAsString(metadata.value));
        });
    }

    return textEntry;
}

export default serializeMetadata;
