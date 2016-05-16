"use strict";
var default_settings_1 = require("./default_settings");
var default_renderer_1 = require("./default_renderer");
var constants_1 = require("./constants");
var request_logger_1 = require("./request_logger");
var utils_1 = require("./utils");
function makeLoggerMiddleware(settings, renderer) {
    var logger = function (next) {
        return function (context) {
            if (settings === undefined) {
                settings = default_settings_1.default;
            }
            ;
            if (renderer === undefined) {
                renderer = default_renderer_1.default;
            }
            ;
            var start = utils_1.getTime();
            var result = next(context);
            var end = utils_1.getTime();
            var log = request_logger_1.default(constants_1.tree.item + " plan\n", settings, context.plan.rootRequest, 0, 0);
            if (settings.time) {
                log = log + "\n Time: " + utils_1.getTimeDiference(start, end) + " millisecond/s.\n";
            }
            renderer(log);
            return result;
        };
    };
    return logger;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = makeLoggerMiddleware;
