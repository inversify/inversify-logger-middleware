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
describe("makeLoggerMiddleware", function () {
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
        function Ninja(weapon) {
            this._weapon = weapon;
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
            __metadata('design:paramtypes', [Object])
        ], Ninja);
        return Ninja;
    }());
    var Samurai = (function () {
        function Samurai(weapon) {
            this._weapon = weapon;
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
            __metadata('design:paramtypes', [Object])
        ], Samurai);
        return Samurai;
    }());
    it("Should be able use default settings", function () {
    });
    it("Should be able use custom settings", function () {
        var kernel = new inversify_1.Kernel();
        kernel.bind("IWeapon").to(Katana).whenInjectedInto(Samurai);
        kernel.bind("IWeapon").to(Shuriken).whenInjectedInto(Ninja);
        kernel.bind("IWarrior").to(Samurai).whenTargetTagged("canSneak", false);
        kernel.bind("IWarrior").to(Ninja).whenTargetTagged("canSneak", true);
        var options = {
            request: {
                bindings: {
                    scope: true
                },
                result: true,
                serviceIdentifier: true
            }
        };
        var makeStringRenderer = function (str) {
            return function (out) {
                str = out;
            };
        };
        var output = "";
        var stringRenderer = makeStringRenderer(output);
        var logger = index_1.default(options, stringRenderer);
        kernel.applyMiddleware(logger);
        var ninja = kernel.getTagged("IWarrior", "canSneak", true);
        chai_1.expect(ninja.fight()).eql("Shuriken");
        chai_1.expect(output).eql("");
        var samurai = kernel.getTagged("IWarrior", "canSneak", false);
        chai_1.expect(samurai.fight()).eql("Katana");
        chai_1.expect(output).eql("");
    });
});
