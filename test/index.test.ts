/// <reference path="../src/interfaces.d.ts" />

import { Kernel, inject, injectable } from "inversify";
import makeLoggerMiddleware from "../src/index";
import { expect } from "chai";
import "reflect-metadata";

describe("makeLoggerMiddleware", () => {

    interface IWeapon {
        name: string;
    }

    interface IWarrior {
        fight(): string;
    }

    @injectable()
    class Katana implements IWeapon {
        public name: string;
        public constructor() {
            this.name = "Katana";
        }
    }

    @injectable()
    class Shuriken implements IWeapon {
        public name: string;
        public constructor() {
            this.name = "Shuriken";
        }
    }

    @injectable()
    class Ninja implements IWarrior {
        private _weapon: IWeapon;
        public constructor(@inject("IWeapon") weapon: IWeapon) {
            this._weapon = weapon;
        }
        public fight() {
            return this._weapon.name;
        }
        public speak() {
            return "你好";
        }
    }

    @injectable()
    class Samurai implements IWarrior {
        private _weapon: IWeapon;
        public constructor(@inject("IWeapon") weapon: IWeapon) {
            this._weapon = weapon;
        }
        public fight() {
            return this._weapon.name;
        }
        public speak() {
            return "こんにちは";
        }
    }

    it("Should be able use default settings", () => {

        // TODO

    });

    it("Should be able use custom settings", () => {

        let kernel = new Kernel();

        kernel.bind<IWeapon>("IWeapon").to(Katana).whenInjectedInto(Samurai);
        kernel.bind<IWeapon>("IWeapon").to(Shuriken).whenInjectedInto(Ninja);
        kernel.bind<IWarrior>("IWarrior").to(Samurai).whenTargetTagged("canSneak", false);
        kernel.bind<IWarrior>("IWarrior").to(Ninja).whenTargetTagged("canSneak", true);

        let options: ILoggerSettings = {
            request: {
                bindings: {
                    scope: true
                },
                result: true,
                serviceIdentifier: true
            }
        };

        let makeStringRenderer = function (str: string) {
            return function (out: string) {
                str = out;
            };
        };

        let output = "";
        let stringRenderer = makeStringRenderer(output);

        let logger = makeLoggerMiddleware(options, stringRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<IWarrior>("IWarrior", "canSneak", true);
        expect(ninja.fight()).eql("Shuriken");

        expect(output).eql("");

        let samurai = kernel.getTagged<IWarrior>("IWarrior", "canSneak", false);
        expect(samurai.fight()).eql("Katana");

        expect(output).eql("");

    });

});
