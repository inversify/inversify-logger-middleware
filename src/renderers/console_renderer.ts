import interfaces from "../interfaces/interfaces";
import textSerializer from "../serializers/text/text_serializer";

function consoleRenderer(entry: interfaces.LogEntry) {
    let text = textSerializer(entry);
    console.log(text);
}

export default consoleRenderer;
