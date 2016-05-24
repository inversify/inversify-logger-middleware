/// <reference path="../interfaces/interfaces.d.ts" />

import textSerializer from "../serializers/text/text_serializer";

function consoleRenderer(entry: ILogEntry) {
    return textSerializer(entry);
}

export default consoleRenderer;
