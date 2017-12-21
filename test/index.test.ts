import * as inversify from "inversify";
import { Container, inject, injectable, targetName, multiInject, ContainerModule } from "inversify";
import { makeLoggerMiddleware, textSerializer } from "../src/index";
import { getTimeFactory } from "../src/utils/utils";
import interfaces from "../src/interfaces/interfaces";
import { expect } from "chai";
import "reflect-metadata";
import "mocha";
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

    let module = new ContainerModule((bind: inversify.interfaces.Bind) => {
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

        let container = new Container();
        container.load(module);

        let loggerOutput: LoggerOutput<string> = { entry: null };
        let stringRenderer = makeStringRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, stringRenderer);
        container.applyMiddleware(logger);

        let ninja = container.getTagged<Warrior>("Warrior", "canSneak", true);
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
                                "                    └── key : inject\n" +
                                "                    └── value : Warrior\n" +
                                "                └── Metadata : 1\n" +
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

        let container = new Container();
        container.load(module);

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
                                "                └── dynamicValue : null\n" +
                                "                └── factory : null\n" +
                                "                └── onActivation : null\n" +
                                "                └── provider : null\n" +
                                "                └── scope : Transient\n" +
                                "        └── target\n" +
                                "            └── serviceIdentifier : Warrior\n" +
                                "            └── name : undefined\n" +
                                "            └── metadata\n" +
                                "                └── Metadata : 0\n" +
                                "                    └── key : inject\n" +
                                "                    └── value : Warrior\n" +
                                "                └── Metadata : 1\n" +
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
                                "                        └── dynamicValue : null\n" +
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
        container.applyMiddleware(logger);

        let ninja = container.getTagged<Warrior>("Warrior", "canSneak", true);
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

        let container = new Container();
        container.load(module);

        let loggerOutput: LoggerOutput<interfaces.LogEntry> = { entry: null };
        let objRenderer = makeObjRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, objRenderer);
        container.applyMiddleware(logger);

        let ninja = container.getTagged<Warrior>("Warrior", "canSneak", true);
        expect(ninja.fight()).eql("Shuriken");
        expect(loggerOutput.entry.error).eql(false);
        expect(loggerOutput.entry.exception).eql(null);
        expect(typeof loggerOutput.entry.time).eql("string");
        expect(typeof loggerOutput.entry.guid).eql("string");
        expect(loggerOutput.entry.guid.length).eql(36);
        expect(loggerOutput.entry.rootRequest.serviceIdentifier).eql("Warrior");

    });

    it("Should be able to log planning errors", () => {

        let container = new Container();
        container.bind<Weapon>("Weapon").to(Katana);
        container.bind<Weapon>("Weapon").to(Shuriken);

        let loggerOutput: LoggerOutput<interfaces.LogEntry> = { entry: null };
        let objRenderer = makeObjRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, objRenderer);
        container.applyMiddleware(logger);

        let tryErro = () => container.get<Warrior>("Weapon");
        let msg = "Ambiguous match found for serviceIdentifier: Weapon\nRegistered bindings:\n Katana\n Shuriken";

        expect(tryErro).to.throw(msg);
        expect(loggerOutput.entry.error).eql(true);
        expect(loggerOutput.entry.exception.message).eql(msg);
        expect(loggerOutput.entry.time).eql(null);
        expect(loggerOutput.entry.rootRequest).eql(null);

    });

    it("Should be able to log pre-planning errors", () => {

        let container = new Container();
        container.load(module);

        let loggerOutput: LoggerOutput<interfaces.LogEntry> = { entry: null };
        let objRenderer = makeObjRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, objRenderer);
        container.applyMiddleware(logger);

        let tryError = () => container.getTagged<Warrior>("WRONG_ID", "canSneak", true);
        let msg = "No matching bindings found for serviceIdentifier: WRONG_ID\n WRONG_ID - tagged: { key:canSneak, value: true }\n";
        expect(tryError).to.throw(msg);
        expect(loggerOutput.entry.error).eql(true);
        expect(loggerOutput.entry.exception.message).eql(msg);
        expect(loggerOutput.entry.time).eql(null);
        expect(loggerOutput.entry.rootRequest).eql(null);

    });

    it("Should be able to log multi-injections", () => {

        let TYPES = {
            Warrior: "Warrior",
            Weapon: "Weapon"
        };

        let container = new Container();
        container.load(module);
        container.unbind(TYPES.Warrior);

        @injectable()
        class SamuraiNinja implements Warrior {
            private _weapons: Weapon[];
            public constructor(@multiInject(TYPES.Weapon) weapons: Weapon[]) {
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

        container.bind<Warrior>(TYPES.Warrior).to(SamuraiNinja);
        container.bind<Weapon>(TYPES.Weapon).to(Katana);
        container.bind<Weapon>(TYPES.Weapon).to(Shuriken);

        let loggerOutput: LoggerOutput<interfaces.LogEntry> = { entry: null };
        let objRenderer = makeObjRenderer(loggerOutput);
        let logger = makeLoggerMiddleware(null, objRenderer);
        container.applyMiddleware(logger);

        let samuraiNinja = container.get<Warrior>(TYPES.Warrior);
        expect(samuraiNinja.fight()).eql("Katana Shuriken");
        expect(loggerOutput.entry.error).eql(false);
        expect(typeof loggerOutput.entry.time).eql("string");
        expect(loggerOutput.entry.rootRequest.childRequests.length).eql(1);
        expect(loggerOutput.entry.rootRequest.childRequests[0].childRequests.length).eql(2);
        expect(loggerOutput.entry.rootRequest.childRequests[0].childRequests[0].bindings[0].implementationType).eql(Katana);
        expect(loggerOutput.entry.rootRequest.childRequests[0].childRequests[1].bindings[0].implementationType).eql(Shuriken);

    });

    it("Should display only the name of implementation types", () => {

        @injectable()
        class MyService {
            public foo() {
                return 123;
            }
        }

        @injectable()
        class MyController {

            @inject(MyService) private myService: MyService;

            public bar() {
                return this.myService.foo();
            }
        }

        const container = new Container();
        container.bind<MyService>(MyService).to(MyService).inSingletonScope();
        container.bind<MyController>(MyController).to(MyController).inSingletonScope();

        let out = "";
        let logger = makeLoggerMiddleware(null, (entry) => { out = textSerializer(entry); });
        container.applyMiddleware(logger);
        container.get<MyController>(MyController);

        let expectedOut =   "SUCCESS: 0.78 ms.\n" +
                            "└── Request : 0\n" +
                            "    └── serviceIdentifier : MyController\n" +
                            "    └── bindings\n" +
                            "        └── Binding<MyController> : 0\n" +
                            "            └── type : Instance\n" +
                            "            └── implementationType : MyController\n" +
                            "            └── scope : Singleton\n" +
                            "    └──  target\n" +
                            "        └── serviceIdentifier : MyController\n" +
                            "        └── name : undefined\n" +
                            "        └── metadata\n" +
                            "            └── Metadata : 0\n" +
                            "                └── key : inject\n" +
                            "                └── value : MyController\n" +
                            "    └── childRequests\n" +
                            "        └── Request : 0\n" +
                            "            └── serviceIdentifier : MyService\n" +
                            "            └── bindings\n" +
                            "                └── Binding<MyService> : 0\n" +
                            "                    └── type : Instance\n" +
                            "                    └── implementationType : MyService\n" +
                            "                    └── scope : Singleton\n" +
                            "            └── target\n" +
                            "                └── serviceIdentifier : MyService\n" +
                            "                └── name : myService\n" +
                            "                └── metadata\n" +
                            "                    └── Metadata : 0\n" +
                            "                        └── key : inject\n" +
                            "                        └── value : MyService\n";

        let lines = out.split("└── ")
                        .map((line) => {
                            return line.split("\u001b[33m").join("")
                                        .split("\u001b[39m").join("");
                        });

        let expectedLines = expectedOut.split("└── ");

        lines.forEach((line: string, index: number) => {
            if (index > 0) {
                expect(line.trim()).eql(expectedLines[index].trim());
            } else {
                expect(line.indexOf("SUCCESS")).not.to.eql(-1);
            }
        });

    });

    it("Should be able to serialize symbols", () => {

        const TYPES = {
            MyController: Symbol.for("MyController"),
            MyService: Symbol.for("MyService")
        };

        @injectable()
        class MyService {
            public foo() {
                return 123;
            }
        }

        @injectable()
        class MyController {

            @inject(TYPES.MyService) private myService: MyService;

            public bar() {
                return this.myService.foo();
            }
        }

        const container = new Container();
        container.bind<MyService>(TYPES.MyService).to(MyService).inSingletonScope();
        container.bind<MyController>(TYPES.MyController).to(MyController).inSingletonScope();

        let out = "";
        let logger = makeLoggerMiddleware(null, (entry) => { out = textSerializer(entry); });
        container.applyMiddleware(logger);
        container.get<MyController>(TYPES.MyController);

        let expectedOut = "SUCCESS: 1.71 ms.\n" +
        "    └── Request : 0\n" +
        "        └── serviceIdentifier : Symbol(MyController)\n" +
        "        └── bindings\n" +
        "            └── Binding<Symbol(MyController)> : 0\n" +
        "                └── type : Instance\n" +
        "                └── implementationType : MyController\n" +
        "                └── scope : Singleton\n" +
        "        └── target\n" +
        "            └── serviceIdentifier : Symbol(MyController)\n" +
        "            └── name : undefined\n" +
        "            └── metadata\n" +
        "                └── Metadata : 0\n" +
        "                    └── key : inject\n" +
        "                    └── value : Symbol(MyController)\n" +
        "        └── childRequests\n" +
        "            └── Request : 0\n" +
        "                └── serviceIdentifier : Symbol(MyService)\n" +
        "                └── bindings\n" +
        "                    └── Binding<Symbol(MyService)> : 0\n" +
        "                        └── type : Instance\n" +
        "                        └── implementationType : MyService\n" +
        "                        └── scope : Singleton\n" +
        "                └── target\n" +
        "                    └── serviceIdentifier : Symbol(MyService)\n" +
        "                    └── name : myService\n" +
        "                    └── metadata\n" +
        "                        └── Metadata : 0\n" +
        "                            └── key : inject\n" +
        "                            └── value : Symbol(MyService)\n";

        let lines = out.split("└── ")
                        .map((line) => {
                            return line.split("\u001b[33m").join("")
                                        .split("\u001b[39m").join("");
                        });

        let expectedLines = expectedOut.split("└── ");

        lines.forEach((line: string, index: number) => {
            if (index > 0) {
                expect(line.trim()).eql(expectedLines[index].trim());
            } else {
                expect(line.indexOf("SUCCESS")).not.to.eql(-1);
            }
        });

    });

    it("Should be able to serialize constant values like strings", () => {

        const TYPES = {
            MyStringValue: Symbol.for("MyStringValue")
        };

        const container = new Container();
        container.bind<string>(TYPES.MyStringValue).toConstantValue("foo");

        let out = "";
        let logger = makeLoggerMiddleware(null, (entry) => { out = textSerializer(entry); });
        container.applyMiddleware(logger);
        container.get<string>(TYPES.MyStringValue);

        let expectedOut = "SUCCESS: 0.75 ms.\n" +
        "    └── Request : 0\n" +
        "        └── serviceIdentifier : Symbol(MyStringValue)\n" +
        "        └── bindings\n" +
        "            └── Binding<Symbol(MyStringValue)> : 0\n" +
        "                └── type : ConstantValue\n" +
        "                └── implementationType : null\n" +
        "                └── scope : Transient\n" +
        "        └── target\n" +
        "            └── serviceIdentifier : Symbol(MyStringValue)\n" +
        "            └── name : undefined\n" +
        "            └── metadata\n" +
        "            └── Metadata : 0\n" +
        "                └── key : inject\n" +
        "                └── value : Symbol(MyStringValue)\n";

        let lines = out.split("└── ")
                        .map((line) => {
                            return line.split("\u001b[33m").join("")
                                        .split("\u001b[39m").join("");
                        });

        let expectedLines = expectedOut.split("└── ");

        lines.forEach((line: string, index: number) => {
            if (index > 0) {
                expect(line.trim()).eql(expectedLines[index].trim());
            } else {
                expect(line.indexOf("SUCCESS")).not.to.eql(-1);
            }
        });

    });

    it("Should use consoleRenderer as default renderer", () => {
        let logger = makeLoggerMiddleware();
        const container = new Container();
        container.applyMiddleware(logger);
        let id = "THIS IS NOT A REAL ERROR IGNORE THIS ERROR IF YOU SEE IT ON THE CI LOGS";
        let tryError = () => container.get(id);
        let logSpy = sandbox.spy(console, "log");
        expect(tryError).to.throw();
        expect(logSpy.firstCall.args[0].indexOf("id")).not.to.eql(-1);
    });

    it("Should use the correct implementation of performance now", () => {

        let fakeWindow = {
            performance: {
                now: () => 1000000
            }
        };

        let fakeProcess = {
            hrtime: () => [2000000]
        };

        class FakeDate {
            public getTime() {
                return 3000000;
            }
        }

        // use window if avaialble
        let getTimePoweredByWindow = getTimeFactory(fakeWindow, null, null);
        expect(getTimePoweredByWindow()).to.be.eql(fakeWindow.performance.now());

        // use process if available
        let getTimePoweredByProcess = getTimeFactory(null, fakeProcess, null);
        expect(getTimePoweredByProcess()).to.be.eql(fakeProcess.hrtime[0] / 1000000);

        // use getTIme if process and window are not available
        let getTimePoweredByDate = getTimeFactory(null, null, FakeDate);
        expect(getTimePoweredByDate()).to.be.eql(new FakeDate().getTime());

    });

});
