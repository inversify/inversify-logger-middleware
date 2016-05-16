"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var inversify_1 = require("inversify");
var index_1 = require("../src/index");
var chai_1 = require("chai");
require("reflect-metadata");
var sinon = require("sinon");
describe("makeLoggerMiddleware", function () {
    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });
    var Katana = (function () {
        function Katana() {
            this.name = "Katana";
        }
        Katana = __decorate([
            inversify_1.injectable(), 
            __metadata('design:paramtypes', [])
        ], Katana);
        return Katana;
    }());
    var Shuriken = (function () {
        function Shuriken() {
            this.name = "Shuriken";
        }
        Shuriken = __decorate([
            inversify_1.injectable(), 
            __metadata('design:paramtypes', [])
        ], Shuriken);
        return Shuriken;
    }());
    var Ninja = (function () {
        function Ninja(shuriken) {
            this._weapon = shuriken;
        }
        Ninja.prototype.fight = function () {
            return this._weapon.name;
        };
        Ninja.prototype.speak = function () {
            return "你好";
        };
        Ninja = __decorate([
            inversify_1.injectable(),
            __param(0, inversify_1.inject("IWeapon")),
            __param(0, inversify_1.targetName("shuriken")), 
            __metadata('design:paramtypes', [Object])
        ], Ninja);
        return Ninja;
    }());
    var Samurai = (function () {
        function Samurai(katana) {
            this._weapon = katana;
        }
        Samurai.prototype.fight = function () {
            return this._weapon.name;
        };
        Samurai.prototype.speak = function () {
            return "こんにちは";
        };
        Samurai = __decorate([
            inversify_1.injectable(),
            __param(0, inversify_1.inject("IWeapon")),
            __param(0, inversify_1.targetName("katana")), 
            __metadata('design:paramtypes', [Object])
        ], Samurai);
        return Samurai;
    }());
    var module = function (k) {
        k.bind("IWeapon").to(Katana).whenInjectedInto(Samurai);
        k.bind("IWeapon").to(Shuriken).whenInjectedInto(Ninja);
        k.bind("IWarrior").to(Samurai).whenTargetTagged("canSneak", false);
        k.bind("IWarrior").to(Ninja).whenTargetTagged("canSneak", true);
    };
    it("Should be able use default settings", function () {
        var kernel = new inversify_1.Kernel();
        kernel.load(module);
        var log = "";
        var logger = index_1.default();
        kernel.applyMiddleware(logger);
        var ninja = kernel.getTagged("IWarrior", "canSneak", true);
        chai_1.expect(ninja.fight()).eql("Shuriken");
        chai_1.expect(log).eql("");
    });
    it("Should be able use custom settings", function () {
        var kernel = new inversify_1.Kernel();
        kernel.load(module);
        var options = {
            request: {
                bindings: {
                    scope: true
                },
                serviceIdentifier: true
            }
        };
        var makeStringRenderer = function (str) {
            return function (out) {
                str = out;
            };
        };
        var log = "";
        var stringRenderer = makeStringRenderer(log);
        var logger = index_1.default(options, stringRenderer);
        kernel.applyMiddleware(logger);
        var ninja = kernel.getTagged("IWarrior", "canSneak", true);
        chai_1.expect(ninja.fight()).eql("Shuriken");
        chai_1.expect(log).eql("");
        var samurai = kernel.getTagged("IWarrior", "canSneak", false);
        chai_1.expect(samurai.fight()).eql("Katana");
        chai_1.expect(log).eql("");
    });
});
