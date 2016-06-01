import { Kernel, inject, injectable, targetName, multiInject } from "inversify";
import { makeLoggerMiddleware, textSerializer } from "../src/index";
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
        public constructor(@inject("IWeapon") @targetName("shuriken") shuriken: IWeapon) {
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

    interface ILoggerOutput<T> {
        entry: T;
    }

    // Takes object (loggerOutput) instead of primitive (string) to share reference
    let makeStringRenderer = function (loggerOutput: ILoggerOutput<string>) {
        return function (entry: ILogEntry) {
            loggerOutput.entry = textSerializer(entry);
        };
    };

    let makeObjRenderer = function (loggerOutput: ILoggerOutput<any>) {
        return function (entry: ILogEntry) {
            loggerOutput.entry = entry;
        };
    };

    it("Should be able use default settings", () => {

        let kernel = new Kernel();
        kernel.load(module);

        let loggerOutput: ILoggerOutput<string> = { entry: null };
        let stringRenderer = makeStringRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, stringRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<IWarrior>("IWarrior", "canSneak", true);
        expect(ninja.fight()).eql("Shuriken");

        let expectedLogEntry =  "SUCCESS: 0.41 ms.\n" +
                                "    └── IRequest : 0\n" +
                                "        └── serviceIdentifier : IWarrior\n" +
                                "        └── bindings\n" +
                                "            └── IBinding<IWarrior> : 0\n" +
                                "                └── type : Instance\n" +
                                "                └── implementationType : Ninja\n" +
                                "                └── scope : Transient\n" +
                                "        └── target\n" +
                                "            └── serviceIdentifier : IWarrior\n" +
                                "            └── name : undefined\n" +
                                "            └── metadata\n" +
                                "                └── IMetadata : 0\n" +
                                "                    └── key : canSneak\n" +
                                "                    └── value : true\n" +
                                "        └── childRequests\n" +
                                "            └── IRequest : 0\n" +
                                "                └── serviceIdentifier : IWeapon\n" +
                                "                └── bindings\n" +
                                "                    └── IBinding<IWeapon> : 0\n" +
                                "                        └── type : Instance\n" +
                                "                        └── implementationType : Shuriken\n" +
                                "                        └── scope : Transient\n" +
                                "                └── target\n" +
                                "                    └── serviceIdentifier : IWeapon\n" +
                                "                    └── name : shuriken\n" +
                                "                    └── metadata\n" +
                                "                        └── IMetadata : 0\n" +
                                "                            └── key : name\n" +
                                "                            └── value : shuriken\n" +
                                "                        └── IMetadata : 1\n" +
                                "                            └── key : inject\n" +
                                "                            └── value : IWeapon\n";

        let lines = loggerOutput.entry.split("└── ")
                                .map((line) => {
                                    return line.split("\u001b[33m").join("")
                                               .split("\u001b[39m").join("");
                                });

        let expectedLines = expectedLogEntry.split("└── ");

        lines.forEach((line: string, index: number) => {
            if (index > 0) {
                expect(line).eql(expectedLines[index]);
            } else {
                expect(line.indexOf("SUCCESS")).not.to.eql(-1);
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
            time: true
        };

        let expectedLogEntry =  "SUCCESS: 0.77 ms.\n" +
                                "    └── IRequest : 0\n" +
                                "        └── serviceIdentifier : IWarrior\n" +
                                "        └── bindings\n" +
                                "            └── IBinding<IWarrior> : 0\n" +
                                "                └── type : Instance\n" +
                                "                └── serviceIdentifier : IWarrior\n" +
                                "                └── implementationType : Ninja\n" +
                                "                └── activated : false\n" +
                                "                └── cache : null\n" +
                                "                └── factory : null\n" +
                                "                └── onActivation : null\n" +
                                "                └── provider : null\n" +
                                "                └── scope : Transient\n" +
                                "        └── target\n" +
                                "            └── serviceIdentifier : IWarrior\n" +
                                "            └── name : undefined\n" +
                                "            └── metadata\n" +
                                "                └── IMetadata : 0\n" +
                                "                    └── key : canSneak\n" +
                                "                    └── value : true\n" +
                                "        └── childRequests\n" +
                                "            └── IRequest : 0\n" +
                                "                └── serviceIdentifier : IWeapon\n" +
                                "                └── bindings\n" +
                                "                    └── IBinding<IWeapon> : 0\n" +
                                "                        └── type : Instance\n" +
                                "                        └── serviceIdentifier : IWeapon\n" +
                                "                        └── implementationType : Shuriken\n" +
                                "                        └── activated : false\n" +
                                "                        └── cache : null\n" +
                                "                        └── factory : null\n" +
                                "                        └── onActivation : null\n" +
                                "                        └── provider : null\n" +
                                "                        └── scope : Transient\n" +
                                "                └── target\n" +
                                "                    └── serviceIdentifier : IWeapon\n" +
                                "                    └── name : shuriken\n" +
                                "                    └── metadata\n" +
                                "                        └── IMetadata : 0\n" +
                                "                            └── key : name\n" +
                                "                            └── value : shuriken\n" +
                                "                        └── IMetadata : 1\n" +
                                "                            └── key : inject\n" +
                                "                            └── value : IWeapon\n";

        let loggerOutput: ILoggerOutput<string> = { entry: null };
        let stringRenderer = makeStringRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(options, stringRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<IWarrior>("IWarrior", "canSneak", true);
        expect(ninja.fight()).eql("Shuriken");

        let lines = loggerOutput.entry.split("└── ")
                                .map((line) => {
                                    return line.split("\u001b[33m").join("")
                                               .split("\u001b[39m").join("");
                                });

        let expectedLines = expectedLogEntry.split("└── ");

        lines.forEach((line: string, index: number) => {
            if (index > 0) {
                expect(line).eql(expectedLines[index]);
            } else {
                expect(line.indexOf("SUCCESS")).not.to.eql(-1);
            }
        });

    });

    it("Should be able use a renderer without serialization", () => {

        let kernel = new Kernel();
        kernel.load(module);

        let loggerOutput: ILoggerOutput<ILogEntry> = { entry: null };
        let objRenderer = makeObjRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, objRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<IWarrior>("IWarrior", "canSneak", true);
        expect(ninja.fight()).eql("Shuriken");

        expect(loggerOutput.entry.error).eql(false);
        expect(loggerOutput.entry.exception).eql(null);
        expect(typeof loggerOutput.entry.time).eql("string");
        expect(loggerOutput.entry.rootRequest.serviceIdentifier).eql("IWarrior");

    });

    it("Should be able to log pre-planning errors", () => {

        let kernel = new Kernel();
        kernel.load(module);

        let loggerOutput: ILoggerOutput<ILogEntry> = { entry: null };
        let objRenderer = makeObjRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, objRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<IWarrior>("WRONG_ID", "canSneak", true);
        expect(ninja).eql(undefined);

        expect(loggerOutput.entry.error).eql(true);
        expect(loggerOutput.entry.exception.message).eql(`No bindings found for serviceIdentifier: WRONG_ID`);
        expect(loggerOutput.entry.time).eql(null);
        expect(loggerOutput.entry.rootRequest).eql(null);

    });

    it("Should be able to log multi-injections", () => {

        let kernel = new Kernel();
        kernel.load(module);
        kernel.unbind("IWarrior");

        @injectable()
        class SamuraiNinja implements IWarrior {
            private _weapons: IWeapon[];
            public constructor(@multiInject("IWeapon") weapons: IWeapon[]) {
                this._weapons = weapons;
            }
            public fight() {
                let s = "";
                this._weapons.forEach((w: IWeapon) => { s = s + " " + w.name; });
                return s.trim();
            }
            public speak() {
                return "こんにちは 你好";
            }
        }

        kernel.bind<IWarrior>("IWarrior").to(SamuraiNinja);

        let loggerOutput: ILoggerOutput<ILogEntry> = { entry: null };
        let objRenderer = makeObjRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, objRenderer);
        kernel.applyMiddleware(logger);

        let samuraiNinja = kernel.get<IWarrior>("IWarrior");
        expect(samuraiNinja.fight()).eql("Katana Shuriken");
        expect(loggerOutput.entry.error).eql(false);
        expect(typeof loggerOutput.entry.time).eql("string");
        expect(loggerOutput.entry.rootRequest.childRequests.length).eql(1);
        expect(loggerOutput.entry.rootRequest.childRequests[0].childRequests.length).eql(2);
        expect(loggerOutput.entry.rootRequest.childRequests[0].childRequests[0].bindings[0].implementationType).eql(Katana);
        expect(loggerOutput.entry.rootRequest.childRequests[0].childRequests[1].bindings[0].implementationType).eql(Shuriken);

    });

});
