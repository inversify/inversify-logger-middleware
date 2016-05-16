/// <reference path="../src/interfaces.d.ts" />

import { Kernel, inject, injectable, targetName } from "inversify";
import makeLoggerMiddleware from "../src/index";
import { expect } from "chai";
import "reflect-metadata";
import * as sinon from "sinon";

describe("makeLoggerMiddleware", () => {

    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

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
        public constructor(@inject("IWeapon")  @targetName("shuriken") shuriken: IWeapon) {
            this._weapon = shuriken;
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
        public constructor(@inject("IWeapon") @targetName("katana") katana: IWeapon) {
            this._weapon = katana;
        }
        public fight() {
            return this._weapon.name;
        }
        public speak() {
            return "こんにちは";
        }
    }

    let module = (k: inversify.IKernel) => {
        k.bind<IWeapon>("IWeapon").to(Katana).whenInjectedInto(Samurai);
        k.bind<IWeapon>("IWeapon").to(Shuriken).whenInjectedInto(Ninja);
        k.bind<IWarrior>("IWarrior").to(Samurai).whenTargetTagged("canSneak", false);
        k.bind<IWarrior>("IWarrior").to(Ninja).whenTargetTagged("canSneak", true);
    };

    it("Should be able use default settings", () => {

        let kernel = new Kernel();
        kernel.load(module);

        let log = "";
/*
        let consoleLogStub = sandbox.stub(console, "log", function(...args: any[]) {
            args.forEach((arg) => {
                log += arg;
            });
        });
*/
        let logger = makeLoggerMiddleware();
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<IWarrior>("IWarrior", "canSneak", true);
        expect(ninja.fight()).eql("Shuriken");
        // expect(consoleLogStub.callCount).eql(1);

        let samurai = kernel.getTagged<IWarrior>("IWarrior", "canSneak", false);
        expect(samurai.fight()).eql("Katana");

        expect(log).eql("");

    });

    it("Should be able use custom settings", () => {

        let kernel = new Kernel();
        kernel.load(module);

        let options: ILoggerSettings = {
            request: {
                bindings: {
                    scope: true
                },
                serviceIdentifier: true
            }
        };

        let makeStringRenderer = function (str: string) {
            return function (out: string) {
                str = out;
            };
        };

        let log = "";
        let stringRenderer = makeStringRenderer(log);

        let logger = makeLoggerMiddleware(options, stringRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<IWarrior>("IWarrior", "canSneak", true);
        expect(ninja.fight()).eql("Shuriken");

        expect(log).eql("");

        let samurai = kernel.getTagged<IWarrior>("IWarrior", "canSneak", false);
        expect(samurai.fight()).eql("Katana");

        expect(log).eql("");

    });

});
