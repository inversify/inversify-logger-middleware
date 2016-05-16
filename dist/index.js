/**
 * inversify-logger-middleware v.1.0.0-alpha.1 - A basic logger middleware for InversifyJS
 * Copyright (c) 2015 Remo H. Jansen <remo.jansen@wolksoftware.com> (http://www.remojansen.com)
 * MIT inversify.io/LICENSE
 * https://github.com/inversify/inversify-logger-middleware#readme
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.inversifyLoggerMidleware = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
};

},{}],2:[function(require,module,exports){
'use strict';

function assembleStyles () {
	var styles = {
		modifiers: {
			reset: [0, 0],
			bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		colors: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39]
		},
		bgColors: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49]
		}
	};

	// fix humans
	styles.colors.grey = styles.colors.gray;

	Object.keys(styles).forEach(function (groupName) {
		var group = styles[groupName];

		Object.keys(group).forEach(function (styleName) {
			var style = group[styleName];

			styles[styleName] = group[styleName] = {
				open: '\u001b[' + style[0] + 'm',
				close: '\u001b[' + style[1] + 'm'
			};
		});

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	});

	return styles;
}

Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});

},{}],3:[function(require,module,exports){
(function (process){
'use strict';
var escapeStringRegexp = require('escape-string-regexp');
var ansiStyles = require('ansi-styles');
var stripAnsi = require('strip-ansi');
var hasAnsi = require('has-ansi');
var supportsColor = require('supports-color');
var defineProps = Object.defineProperties;
var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

function Chalk(options) {
	// detect mode if not set manually
	this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
}

// use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001b[94m';
}

var styles = (function () {
	var ret = {};

	Object.keys(ansiStyles).forEach(function (key) {
		ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

		ret[key] = {
			get: function () {
				return build.call(this, this._styles.concat(key));
			}
		};
	});

	return ret;
})();

var proto = defineProps(function chalk() {}, styles);

function build(_styles) {
	var builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	builder._styles = _styles;
	builder.enabled = this.enabled;
	// __proto__ is used because we must return a function, but there is
	// no way to create a function with a different prototype.
	/* eslint-disable no-proto */
	builder.__proto__ = proto;

	return builder;
}

function applyStyle() {
	// support varags, but simply cast to string in case there's only one arg
	var args = arguments;
	var argsLen = args.length;
	var str = argsLen !== 0 && String(arguments[0]);

	if (argsLen > 1) {
		// don't slice `arguments`, it prevents v8 optimizations
		for (var a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || !str) {
		return str;
	}

	var nestedStyles = this._styles;
	var i = nestedStyles.length;

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	var originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
		ansiStyles.dim.open = '';
	}

	while (i--) {
		var code = ansiStyles[nestedStyles[i]];

		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;
	}

	// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
	ansiStyles.dim.open = originalDim;

	return str;
}

function init() {
	var ret = {};

	Object.keys(styles).forEach(function (name) {
		ret[name] = {
			get: function () {
				return build.call(this, [name]);
			}
		};
	});

	return ret;
}

defineProps(Chalk.prototype, init());

module.exports = new Chalk();
module.exports.styles = ansiStyles;
module.exports.hasColor = hasAnsi;
module.exports.stripColor = stripAnsi;
module.exports.supportsColor = supportsColor;

}).call(this,require('_process'))

},{"_process":6,"ansi-styles":2,"escape-string-regexp":4,"has-ansi":5,"strip-ansi":7,"supports-color":8}],4:[function(require,module,exports){
'use strict';

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};

},{}],5:[function(require,module,exports){
'use strict';
var ansiRegex = require('ansi-regex');
var re = new RegExp(ansiRegex().source); // remove the `g` flag
module.exports = re.test.bind(re);

},{"ansi-regex":1}],6:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
'use strict';
var ansiRegex = require('ansi-regex')();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};

},{"ansi-regex":1}],8:[function(require,module,exports){
(function (process){
'use strict';
var argv = process.argv;

var terminator = argv.indexOf('--');
var hasFlag = function (flag) {
	flag = '--' + flag;
	var pos = argv.indexOf(flag);
	return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
};

module.exports = (function () {
	if ('FORCE_COLOR' in process.env) {
		return true;
	}

	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
		return false;
	}

	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return true;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return false;
	}

	if (process.platform === 'win32') {
		return true;
	}

	if ('COLORTERM' in process.env) {
		return true;
	}

	if (process.env.TERM === 'dumb') {
		return false;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
		return true;
	}

	return false;
})();

}).call(this,require('_process'))

},{"_process":6}],9:[function(require,module,exports){
"use strict";
var utils_1 = require("./utils");
function getBindingLogEntry(log, options, index, binding, indentationForDepth) {
    var logProperty = utils_1.makePropertyLogger(indentationForDepth);
    log = logProperty(log, 0, "item", index);
    var props = [
        "type", "serviceIdentifier", "implementationType",
        "activated", "cache", "constraint", "dynamicValue",
        "factory", "onActivation", "provider", "scope"
    ];
    props.forEach(function (prop) {
        var _bindings = options.request.bindings;
        var _binding = binding;
        if (_bindings[prop]) {
            var value = (prop === "implementationType") ? (_binding[prop].name || undefined) : _binding[prop];
            value = (value === null || value === undefined) ? "null" : value;
            log = logProperty(log, 1, prop, value);
        }
    });
    return log;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getBindingLogEntry;
},{"./utils":16}],10:[function(require,module,exports){
"use strict";
var tree = {
    item: "└──"
};
exports.tree = tree;
var indentation = "    ";
exports.indentation = indentation;
},{}],11:[function(require,module,exports){
"use strict";
function consoleRenderer(out) {
    console.log(out);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = consoleRenderer;
},{}],12:[function(require,module,exports){
"use strict";
var deatultOptions = {
    request: {
        bindings: {
            activated: true,
            cache: true,
            constraint: false,
            dynamicValue: true,
            factory: true,
            implementationType: true,
            onActivation: true,
            provider: true,
            scope: true,
            serviceIdentifier: true,
            type: true
        },
        serviceIdentifier: true,
        target: {
            metadata: true,
            name: true,
            serviceIdentifier: true
        }
    },
    time: true,
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deatultOptions;
},{}],13:[function(require,module,exports){
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
},{"./constants":10,"./default_renderer":11,"./default_settings":12,"./request_logger":14,"./utils":16}],14:[function(require,module,exports){
"use strict";
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var binding_logger_1 = require("./binding_logger");
var target_logger_1 = require("./target_logger");
var utils_2 = require("./utils");
function getRequestLogEntry(log, options, request, depth, index) {
    var indentationForDepth = utils_1.getIndentationForDepth(depth);
    var logProperty = utils_2.makePropertyLogger(indentationForDepth);
    log = logProperty(log, 0, "item", index);
    if (options.request.serviceIdentifier === true) {
        log = logProperty(log, 1, "serviceIdentifier", request.serviceIdentifier);
    }
    if (options.request.bindings !== undefined) {
        log = logProperty(log, 1, "bindings");
        request.bindings.forEach(function (binding, i) {
            log = binding_logger_1.default(log, options, i, binding, "" + indentationForDepth + constants_1.indentation + constants_1.indentation);
        });
    }
    if (options.request.target !== undefined) {
        log = target_logger_1.default(log, options, request.target, "" + indentationForDepth + constants_1.indentation);
    }
    if (request.childRequests.length > 0) {
        log = logProperty(log, 1, "childRequests");
    }
    request.childRequests.forEach(function (childRequest, i) {
        log = getRequestLogEntry(log, options, childRequest, (depth + 2), i);
    });
    return log;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getRequestLogEntry;
},{"./binding_logger":9,"./constants":10,"./target_logger":15,"./utils":16}],15:[function(require,module,exports){
"use strict";
var utils_1 = require("./utils");
function getTargetLogEntry(log, options, target, indentationForDepth) {
    var logProperty = utils_1.makePropertyLogger(indentationForDepth);
    log = logProperty(log, 0, "target");
    if (options.request.target.name) {
        log = logProperty(log, 1, "name", (target.name.value() || "undefined"));
    }
    if (options.request.target.serviceIdentifier) {
        log = logProperty(log, 1, "serviceIdentifier", target.serviceIdentifier);
    }
    if (options.request.target.metadata) {
        log = logProperty(log, 1, "metadata");
        target.metadata.forEach(function (m, i) {
            log = logProperty(log, 2, "item", i);
            log = logProperty(log, 3, "key", m.key);
            log = logProperty(log, 3, "value", m.value);
        });
    }
    return log;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getTargetLogEntry;
},{"./utils":16}],16:[function(require,module,exports){
(function (process){
"use strict";
var constants_1 = require("./constants");
var chalk = require("chalk");
var cyan = chalk.cyan;
exports.cyan = cyan;
var yellow = chalk.yellow;
exports.yellow = yellow;
function getIndentationForDepth(depth) {
    var indentationForDepth = constants_1.indentation;
    for (var i = depth; i--; i >= 0) {
        indentationForDepth = "" + indentationForDepth + constants_1.indentation;
    }
    return indentationForDepth;
}
exports.getIndentationForDepth = getIndentationForDepth;
function getTime() {
    if (typeof window !== "undefined") {
        return window.performance.now();
    }
    else if (typeof process !== "undefined") {
        var nanoseconds = process.hrtime()[1];
        var milliseconds = nanoseconds / 1000000;
        return milliseconds;
    }
    else {
        return new Date().getTime();
    }
}
exports.getTime = getTime;
function getTimeDiference(start, end) {
    var diff = end - start;
    var formatted = diff.toFixed(2);
    return formatted;
}
exports.getTimeDiference = getTimeDiference;
function makePropertyLogger(indentationForDepth) {
    return function (log, tabCount, key, value) {
        var line = "" + log + indentationForDepth;
        for (var i = tabCount; i > 0; i--) {
            line = "" + line + constants_1.indentation;
        }
        line = "" + line + constants_1.tree.item + " " + key;
        if (value !== undefined) {
            line = line + " : " + yellow(value.toString());
        }
        return line + "\n";
    };
}
exports.makePropertyLogger = makePropertyLogger;
}).call(this,require('_process'))

},{"./constants":10,"_process":6,"chalk":3}]},{},[13])(13)
});


//# sourceMappingURL=index.js.map
