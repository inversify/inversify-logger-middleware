import serializeRequest from "./request_serializer";
import { green, red } from "./text_serializer_utils";

function textSerializer(entry: ILogEntry) {
    let textEntry = "";
    if (entry.error) {
        textEntry = `${textEntry}\n${red(`\nERROR: ${entry.exception.message}\n${entry.exception.stack}`)}\n`;
    } else {
        textEntry = `${textEntry}\n${green(`SUCCESS: ${entry.time} ms.`)}\n`;
    }
    textEntry = serializeRequest(textEntry, 0, 0, entry.rootRequest);
    return textEntry;
}

export default textSerializer;
