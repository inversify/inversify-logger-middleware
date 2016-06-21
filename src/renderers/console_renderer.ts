import interfaces from "../interfaces/interfaces";
import textSerializer from "../serializers/text/text_serializer";

function consoleRenderer(entry: interfaces.LogEntry) {
    return textSerializer(entry);
}

export default consoleRenderer;
