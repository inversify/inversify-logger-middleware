import serializeRequest from "./request_serializer";
import { green, red } from "./text_serializer_utils";

function textSerializer(entry: ILogEntry) {
    let textEntry = "";
    if (entry.error) {
        textEntry = `${textEntry}\n${red(`\nERROR: ${entry.exception.message}\n${entry.exception.stack}`)}\n`;
    } else {
        textEntry = `${textEntry}\n${green(`SUCCESS: ${entry.time} ms.`)}\n`;
    }
    entry.requests.forEach((request) => {
        textEntry = serializeRequest(textEntry, 0, 0, request);
    });
    return textEntry;
}

export default textSerializer;
