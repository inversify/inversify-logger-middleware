/**
 * inversify-logger-middleware v.1.0.0-alpha.1 - A basic logger middleware for InversifyJS
 * Copyright (c) 2015 Remo H. Jansen <remo.jansen@wolksoftware.com> (http://www.remojansen.com)
 * MIT inversify.io/LICENSE
 * https://github.com/inversify/inversify-logger-middleware#readme
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.inversifyLoggerMidleware = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var dir = {
    a: "├──",
    b: "└──",
    c: "│",
    d: ""
};
var deatultOptions = {
    request: {
        bindings: {
            activated: false,
            cache: false,
            constraint: false,
            dynamicValue: false,
            factory: false,
            implementationType: false,
            onActivation: false,
            provider: false,
            scope: false,
            serviceIdentifier: false,
            type: false
        },
        result: false,
        serviceIdentifier: false,
        target: {
            metadata: false,
            name: false,
            serviceIdentifier: false
        }
    }
};
function consoleRenderer(out) {
    console.log(out);
}
function makeLoggerMiddleware(settings, renderer) {
    var logger = function (next) {
        return function (context) {
            if (settings === undefined) {
                settings = deatultOptions;
            }
            ;
            if (renderer === undefined) {
                renderer = consoleRenderer;
            }
            ;
            var result = next(context);
            console.log(dir);
            return result;
        };
    };
    return logger;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = makeLoggerMiddleware;

},{}]},{},[1])(1)
});


//# sourceMappingURL=index.js.map
