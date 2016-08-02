import { Kernel, inject, injectable, targetName, multiInject, KernelModule } from "inversify";
import { makeLoggerMiddleware, textSerializer } from "../src/index";
import interfaces from "../src/interfaces/interfaces";
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

    interface Weapon {
        name: string;
    }

    interface Warrior {
        fight(): string;
    }

    @injectable()
    class Katana implements Weapon {
        public name: string;
        public constructor() {
            this.name = "Katana";
        }
    }

    @injectable()
    class Shuriken implements Weapon {
        public name: string;
        public constructor() {
            this.name = "Shuriken";
        }
    }

    @injectable()
    class Ninja implements Warrior {
        private _weapon: Weapon;
        public constructor(@inject("Weapon") @targetName("shuriken") shuriken: Weapon) {
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
    class Samurai implements Warrior {
        private _weapon: Weapon;
        public constructor(@inject("Weapon") @targetName("katana") katana: Weapon) {
            this._weapon = katana;
        }
        public fight() {
            return this._weapon.name;
        }
        public speak() {
            return "こんにちは";
        }
    }

    let module = new KernelModule((bind: inversify.interfaces.Bind) => {
        bind<Weapon>("Weapon").to(Katana).whenInjectedInto(Samurai);
        bind<Weapon>("Weapon").to(Shuriken).whenInjectedInto(Ninja);
        bind<Warrior>("Warrior").to(Samurai).whenTargetTagged("canSneak", false);
        bind<Warrior>("Warrior").to(Ninja).whenTargetTagged("canSneak", true);
    });

    interface LoggerOutput<T> {
        entry: T;
    }

    // Takes object (loggerOutput) instead of primitive (string) to share reference
    let makeStringRenderer = function (loggerOutput: LoggerOutput<string>) {
        return function (entry: interfaces.LogEntry) {
            loggerOutput.entry = textSerializer(entry);
        };
    };

    let makeObjRenderer = function (loggerOutput: LoggerOutput<any>) {
        return function (entry:  interfaces.LogEntry) {
            loggerOutput.entry = entry;
        };
    };

    it("Should be able use default settings", () => {

        let kernel = new Kernel();
        kernel.load(module);

        let loggerOutput: LoggerOutput<string> = { entry: null };
        let stringRenderer = makeStringRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, stringRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<Warrior>("Warrior", "canSneak", true);
        expect(ninja.fight()).eql("Shuriken");

        let expectedLogEntry =  "SUCCESS: 0.41 ms.\n" +
                                "    └── Request : 0\n" +
                                "        └── serviceIdentifier : Warrior\n" +
                                "        └── bindings\n" +
                                "            └── Binding<Warrior> : 0\n" +
                                "                └── type : Instance\n" +
                                "                └── implementationType : Ninja\n" +
                                "                └── scope : Transient\n" +
                                "        └── target\n" +
                                "            └── serviceIdentifier : Warrior\n" +
                                "            └── name : undefined\n" +
                                "            └── metadata\n" +
                                "                └── Metadata : 0\n" +
                                "                    └── key : canSneak\n" +
                                "                    └── value : true\n" +
                                "        └── childRequests\n" +
                                "            └── Request : 0\n" +
                                "                └── serviceIdentifier : Weapon\n" +
                                "                └── bindings\n" +
                                "                    └── Binding<Weapon> : 0\n" +
                                "                        └── type : Instance\n" +
                                "                        └── implementationType : Shuriken\n" +
                                "                        └── scope : Transient\n" +
                                "                └── target\n" +
                                "                    └── serviceIdentifier : Weapon\n" +
                                "                    └── name : shuriken\n" +
                                "                    └── metadata\n" +
                                "                        └── Metadata : 0\n" +
                                "                            └── key : name\n" +
                                "                            └── value : shuriken\n" +
                                "                        └── Metadata : 1\n" +
                                "                            └── key : inject\n" +
                                "                            └── value : Weapon\n";

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

        let options: interfaces.LoggerSettings = {
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
                                "    └── Request : 0\n" +
                                "        └── serviceIdentifier : Warrior\n" +
                                "        └── bindings\n" +
                                "            └── Binding<Warrior> : 0\n" +
                                "                └── type : Instance\n" +
                                "                └── serviceIdentifier : Warrior\n" +
                                "                └── implementationType : Ninja\n" +
                                "                └── activated : false\n" +
                                "                └── cache : null\n" +
                                "                └── factory : null\n" +
                                "                └── onActivation : null\n" +
                                "                └── provider : null\n" +
                                "                └── scope : Transient\n" +
                                "        └── target\n" +
                                "            └── serviceIdentifier : Warrior\n" +
                                "            └── name : undefined\n" +
                                "            └── metadata\n" +
                                "                └── Metadata : 0\n" +
                                "                    └── key : canSneak\n" +
                                "                    └── value : true\n" +
                                "        └── childRequests\n" +
                                "            └── Request : 0\n" +
                                "                └── serviceIdentifier : Weapon\n" +
                                "                └── bindings\n" +
                                "                    └── Binding<Weapon> : 0\n" +
                                "                        └── type : Instance\n" +
                                "                        └── serviceIdentifier : Weapon\n" +
                                "                        └── implementationType : Shuriken\n" +
                                "                        └── activated : false\n" +
                                "                        └── cache : null\n" +
                                "                        └── factory : null\n" +
                                "                        └── onActivation : null\n" +
                                "                        └── provider : null\n" +
                                "                        └── scope : Transient\n" +
                                "                └── target\n" +
                                "                    └── serviceIdentifier : Weapon\n" +
                                "                    └── name : shuriken\n" +
                                "                    └── metadata\n" +
                                "                        └── Metadata : 0\n" +
                                "                            └── key : name\n" +
                                "                            └── value : shuriken\n" +
                                "                        └── Metadata : 1\n" +
                                "                            └── key : inject\n" +
                                "                            └── value : Weapon\n";

        let loggerOutput: LoggerOutput<string> = { entry: null };
        let stringRenderer = makeStringRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(options, stringRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<Warrior>("Warrior", "canSneak", true);
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

        let loggerOutput: LoggerOutput<interfaces.LogEntry> = { entry: null };
        let objRenderer = makeObjRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, objRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<Warrior>("Warrior", "canSneak", true);
        expect(ninja.fight()).eql("Shuriken");

        expect(loggerOutput.entry.error).eql(false);
        expect(loggerOutput.entry.exception).eql(null);
        expect(typeof loggerOutput.entry.time).eql("string");
        expect(typeof loggerOutput.entry.guid).eql("string");
        expect(loggerOutput.entry.guid.length).eql(36);
        expect(loggerOutput.entry.rootRequest.serviceIdentifier).eql("Warrior");

    });

    it("Should be able to log planning errors", () => {

        let kernel = new Kernel();
        kernel.bind<Weapon>("Weapon").to(Katana);
        kernel.bind<Weapon>("Weapon").to(Shuriken);

        let loggerOutput: LoggerOutput<interfaces.LogEntry> = { entry: null };
        let objRenderer = makeObjRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, objRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.get<Warrior>("Weapon");
        expect(ninja).eql(undefined);

        expect(loggerOutput.entry.error).eql(true);
        let msg = "Ambiguous match found for serviceIdentifier: Weapon\nRegistered bindings:\n Katana\n Shuriken";
        expect(loggerOutput.entry.exception.message).eql(msg);
        expect(loggerOutput.entry.time).eql(null);
        expect(loggerOutput.entry.rootRequest).eql(null);

    });

    it("Should be able to log pre-planning errors", () => {

        let kernel = new Kernel();
        kernel.load(module);

        let loggerOutput: LoggerOutput<interfaces.LogEntry> = { entry: null };
        let objRenderer = makeObjRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, objRenderer);
        kernel.applyMiddleware(logger);

        let ninja = kernel.getTagged<Warrior>("WRONG_ID", "canSneak", true);
        expect(ninja).eql(undefined);

        expect(loggerOutput.entry.error).eql(true);
        let msg = "No bindings found for serviceIdentifier: WRONG_ID\n WRONG_ID - tagged: { key:canSneak, value: true }";
        expect(loggerOutput.entry.exception.message).eql(msg);
        expect(loggerOutput.entry.time).eql(null);
        expect(loggerOutput.entry.rootRequest).eql(null);

    });

    it("Should be able to log multi-injections", () => {

        let kernel = new Kernel();
        kernel.load(module);
        kernel.unbind("Warrior");

        @injectable()
        class SamuraiNinja implements Warrior {
            private _weapons: Weapon[];
            public constructor(@multiInject("Weapon") weapons: Weapon[]) {
                this._weapons = weapons;
            }
            public fight() {
                let s = "";
                this._weapons.forEach((w: Weapon) => { s = s + " " + w.name; });
                return s.trim();
            }
            public speak() {
                return "こんにちは 你好";
            }
        }

        kernel.bind<Warrior>("Warrior").to(SamuraiNinja);

        let loggerOutput: LoggerOutput<interfaces.LogEntry> = { entry: null };
        let objRenderer = makeObjRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, objRenderer);
        kernel.applyMiddleware(logger);

        let samuraiNinja = kernel.get<Warrior>("Warrior");
        expect(samuraiNinja.fight()).eql("Katana Shuriken");
        expect(loggerOutput.entry.error).eql(false);
        expect(typeof loggerOutput.entry.time).eql("string");
        expect(loggerOutput.entry.rootRequest.childRequests.length).eql(1);
        expect(loggerOutput.entry.rootRequest.childRequests[0].childRequests.length).eql(2);
        expect(loggerOutput.entry.rootRequest.childRequests[0].childRequests[0].bindings[0].implementationType).eql(Katana);
        expect(loggerOutput.entry.rootRequest.childRequests[0].childRequests[1].bindings[0].implementationType).eql(Shuriken);

    });

});
