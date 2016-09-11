import { interfaces } from "inversify";
import { getIndentationForDepth, makePropertyLogger } from "./text_serializer_utils";

function serializeMetadata(textEntry: string, depth: number, metadatas: interfaces.Metadata[]) {

    let indentation = getIndentationForDepth(depth);
    let propertyLogger = makePropertyLogger(indentation);

    if (metadatas && Array.isArray(metadatas)) {
        textEntry = propertyLogger(textEntry, 2, "metadata");
        metadatas.forEach((metadata: interfaces.Metadata, index: number) => {
            textEntry = propertyLogger(textEntry, 3, "Metadata", index.toString());
            textEntry = propertyLogger(textEntry, 4, "key", metadata.key);
            textEntry = propertyLogger(textEntry, 4, "value", metadata.value);
        });
    }

    return textEntry;
}

export default serializeMetadata;
