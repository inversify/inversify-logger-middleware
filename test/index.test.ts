/// <reference path="../src/interfaces.d.ts" />

import { Kernel, inject, injectable, targetName } from "inversify";
import makeLoggerMiddleware from "../src/index";
import { expect } from "chai";
import "reflect-metadata";
import * as sinon from "sinon";

describe("makeLoggerMiddleware", () => {

    let sandbox: sinon.SinonSandbox;

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

    let makeStringRenderer = function (loggerOutput: { content: string }) {
        return function (out: string) {
            loggerOutput.content = out;
        };
    };

    it("Should be able use default settings", () => {

        let kernel = new Kernel();
        kernel.load(module);

        let loggerOutput = { content : "" };
        let stringRenderer = makeStringRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, stringRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<IWarrior>("IWarrior", "canSneak", true);
        expect(ninja.fight()).eql("Shuriken");

        let expectedLogEntry =  "└── plan\n" +
                                "    └── item : 0\n" +
                                "        └── serviceIdentifier : IWarrior\n" +
                                "        └── bindings\n" +
                                "            └── item : 0\n" +
                                "                └── implementationType : Ninja\n" +
                                "        └── target\n" +
                                "            └── metadata\n" +
                                "                └── item : 0\n" +
                                "                    └── key : canSneak\n" +
                                "                    └── value : true\n" +
                                "        └── childRequests\n" +
                                "            └── item : 0\n" +
                                "                └── serviceIdentifier : IWeapon\n" +
                                "                └── bindings\n" +
                                "                    └── item : 0\n" +
                                "                        └── implementationType : Shuriken\n" +
                                "                └── target\n" +
                                "                    └── metadata\n" +
                                "                        └── item : 0\n" +
                                "                            └── key : name\n" +
                                "                            └── value : shuriken\n" +
                                "                        └── item : 1\n" +
                                "                            └── key : inject\n" +
                                "                            └── value : IWeapon\n\n" +
                                " Time: 0.36 millisecond/s.\n";

        let lines = loggerOutput.content.split("└── ")
                                .map((line) => {
                                    return line.split("\u001b[33m").join("")
                                               .split("\u001b[39m").join("");
                                });

        let expectedLines = expectedLogEntry.split("└── ");

        lines.forEach((line, index) => {
            if (index < (lines.length - 1)) {
                expect(line).eql(expectedLines[index]);
            } else {
                let timeLine = line.split(" ");
                let expectedTimeLine = expectedLines[index].split(" ");
                expect(timeLine[0]).eql(expectedTimeLine[0]);
                expect(timeLine[1]).eql(expectedTimeLine[1]);
                expect(timeLine[2]).eql(expectedTimeLine[2]);
                expect(timeLine[3]).eql(expectedTimeLine[3]);
                expect(timeLine[5]).eql(expectedTimeLine[5]);
            }
        });
    });

    it("Should be able use custom settings", () => {

        let kernel = new Kernel();
        kernel.load(module);

        let options: ILoggerSettings = {
            request: {
                bindings: {
                    activated: true,
                    cache: true,
                    constraint: true,
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
            time: true
        };

        let expectedLogEntry =  "└── plan\n" +
                                "    └── item : 0\n" +
                                "        └── serviceIdentifier : IWarrior\n" +
                                "        └── bindings\n" +
                                "            └── item : 0\n" +
                                "                └── type : Instance\n" +
                                "                └── serviceIdentifier : IWarrior\n" +
                                "                └── implementationType : Ninja\n" +
                                "                └── activated : false\n" +
                                "                └── cache : null\n" +
                                "                └── constraint : function (request) {\n" +
                                "    return request.target.matchesTag(key)(value);\n" +
                                "}\n" +
                                "                └── dynamicValue : null\n" +
                                "                └── factory : null\n" +
                                "                └── onActivation : null\n" +
                                "                └── provider : null\n" +
                                "                └── scope : Transient\n" +
                                "        └── target\n" +
                                "            └── name : undefined\n" +
                                "            └── serviceIdentifier : IWarrior\n" +
                                "            └── metadata\n" +
                                "                └── item : 0\n" +
                                "                    └── key : canSneak\n" +
                                "                    └── value : true\n" +
                                "        └── childRequests\n" +
                                "            └── item : 0\n" +
                                "                └── serviceIdentifier : IWeapon\n" +
                                "                └── bindings\n" +
                                "                    └── item : 0\n" +
                                "                        └── type : Instance\n" +
                                "                        └── serviceIdentifier : IWeapon\n" +
                                "                        └── implementationType : Shuriken\n" +
                                "                        └── activated : false\n" +
                                "                        └── cache : null\n" +
                                "                        └── constraint : function (request) {\n" +
                                "            return constraint_helpers_1.typeConstraint(parent)(request.parentRequest);\n" +
                                "        }\n" +
                                "                        └── dynamicValue : null\n" +
                                "                        └── factory : null\n" +
                                "                        └── onActivation : null\n" +
                                "                        └── provider : null\n" +
                                "                        └── scope : Transient\n" +
                                "                └── target\n" +
                                "                    └── name : shuriken\n" +
                                "                    └── serviceIdentifier : IWeapon\n" +
                                "                    └── metadata\n" +
                                "                        └── item : 0\n" +
                                "                            └── key : name\n" +
                                "                            └── value : shuriken\n" +
                                "                        └── item : 1\n" +
                                "                            └── key : inject\n" +
                                "                            └── value : IWeapon\n\n" +
                                " Time: 0.13 millisecond/s.\n";

        let loggerOutput = { content: "" };
        let stringRenderer = makeStringRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(options, stringRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<IWarrior>("IWarrior", "canSneak", true);
        expect(ninja.fight()).eql("Shuriken");

        let lines = loggerOutput.content.split("└── ")
                                .map((line) => {
                                    return line.split("\u001b[33m").join("")
                                               .split("\u001b[39m").join("");
                                });

        let expectedLines = expectedLogEntry.split("└── ");

        lines.forEach((line, index) => {
            if (index < (lines.length - 1)) {
                expect(line).eql(expectedLines[index]);
            } else {
                let timeLine = line.split(" ");
                let expectedTimeLine = expectedLines[index].split(" ");
                expect(timeLine[0]).eql(expectedTimeLine[0]);
                expect(timeLine[1]).eql(expectedTimeLine[1]);
                expect(timeLine[2]).eql(expectedTimeLine[2]);
                expect(timeLine[3]).eql(expectedTimeLine[3]);
                expect(timeLine[5]).eql(expectedTimeLine[5]);
            }
        });

    });

});
