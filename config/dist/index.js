"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const lodash_assignin_1 = __importDefault(require("lodash.assignin"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const lodash_pick_1 = __importDefault(require("lodash.pick"));
const module_1 = __importDefault(require("module"));
const find_up_1 = __importDefault(require("find-up"));
const conf_1 = __importDefault(require("conf"));
const error_1 = __importDefault(require("@truffle/error"));
const original_require_1 = __importDefault(require("original-require"));
const configDefaults_1 = require("./configDefaults");
const events_1 = require("@truffle/events");
const DEFAULT_CONFIG_FILENAME = "truffle-config.js";
const BACKUP_CONFIG_FILENAME = "truffle.js"; // old config filename
class TruffleConfig {
    constructor(truffleDirectory, workingDirectory, network) {
        this._deepCopy = ["compilers", "mocha"];
        this._values = configDefaults_1.getInitialConfig({
            truffleDirectory,
            workingDirectory,
            network
        });
        const eventsOptions = this.eventManagerOptions(this);
        this.events = new events_1.EventManager(eventsOptions);
        const props = configDefaults_1.configProps({ configObject: this });
        Object.entries(props).forEach(([propName, descriptor]) => this.addProp(propName, descriptor));
    }
    eventManagerOptions(options) {
        const optionsWhitelist = ["quiet", "logger", "subscribers"];
        return lodash_pick_1.default(options, optionsWhitelist);
    }
    addProp(propertyName, descriptor) {
        // possible property descriptors
        //
        // supports `default` and `transform` in addition to `get` and `set`
        //
        // default: specify function to retrieve default value (used by get)
        // transform: specify function to transform value when (used by set)
        const self = this;
        Object.defineProperty(this, propertyName, {
            get: descriptor.get ||
                function () {
                    // value is specified
                    if (propertyName in self._values) {
                        return self._values[propertyName];
                    }
                    // default getter is specified
                    if (descriptor.default) {
                        return descriptor.default();
                    }
                    // descriptor is a function
                    return descriptor();
                },
            set: descriptor.set ||
                function (value) {
                    self._values[propertyName] = descriptor.transform
                        ? descriptor.transform(value)
                        : value;
                },
            configurable: true,
            enumerable: true
        });
    }
    normalize(obj) {
        const clone = {};
        Object.keys(obj).forEach(key => {
            try {
                clone[key] = obj[key];
            }
            catch (e) {
                // Do nothing with values that throw.
            }
        });
        return clone;
    }
    with(obj) {
        const current = this.normalize(this);
        const normalized = this.normalize(obj);
        const currentEventsOptions = this.eventManagerOptions(this);
        const optionsToMerge = this.eventManagerOptions(obj);
        this.events.updateSubscriberOptions(Object.assign(Object.assign({}, currentEventsOptions), optionsToMerge));
        return lodash_assignin_1.default(Object.create(TruffleConfig.prototype), current, normalized);
    }
    merge(obj) {
        const clone = this.normalize(obj);
        // Only set keys for values that don't throw.
        const propertyNames = Object.keys(obj);
        propertyNames.forEach(key => {
            try {
                if (typeof clone[key] === "object" && this._deepCopy.includes(key)) {
                    this[key] = lodash_merge_1.default(this[key], clone[key]);
                }
                else {
                    this[key] = clone[key];
                }
            }
            catch (e) {
                // ignore
            }
        });
        const eventsOptions = this.eventManagerOptions(this);
        this.events.updateSubscriberOptions(eventsOptions);
        return this;
    }
    static default() {
        return new TruffleConfig();
    }
    static search(options = {}, filename) {
        const searchOptions = {
            cwd: options.working_directory || options.workingDirectory
        };
        if (!filename) {
            const isWin = process.platform === "win32";
            const defaultConfig = find_up_1.default.sync(DEFAULT_CONFIG_FILENAME, searchOptions);
            const backupConfig = find_up_1.default.sync(BACKUP_CONFIG_FILENAME, searchOptions);
            if (defaultConfig && backupConfig) {
                console.warn(`Warning: Both ${DEFAULT_CONFIG_FILENAME} and ${BACKUP_CONFIG_FILENAME} were found. Using ${DEFAULT_CONFIG_FILENAME}.`);
                return defaultConfig;
            }
            else if (backupConfig && !defaultConfig) {
                if (isWin)
                    console.warn(`Warning: Please rename ${BACKUP_CONFIG_FILENAME} to ${DEFAULT_CONFIG_FILENAME} to ensure Windows compatibility.`);
                return backupConfig;
            }
            else {
                return defaultConfig;
            }
        }
        return find_up_1.default.sync(filename, searchOptions);
    }
    static detect(options = {}, filename) {
        let configFile;
        const configPath = options.config;
        if (configPath) {
            configFile = path_1.default.isAbsolute(configPath)
                ? configPath
                : path_1.default.resolve(configPath);
        }
        else {
            configFile = TruffleConfig.search(options, filename);
        }
        if (!configFile) {
            throw new error_1.default("Could not find suitable configuration file.");
        }
        return TruffleConfig.load(configFile, options);
    }
    static load(file, options = {}) {
        const workingDirectory = options.config
            ? process.cwd()
            : path_1.default.dirname(path_1.default.resolve(file));
        const config = new TruffleConfig(undefined, workingDirectory, undefined);
        // The require-nocache module used to do this for us, but
        // it doesn't bundle very well. So we've pulled it out ourselves.
        // @ts-ignore
        delete require.cache[module_1.default._resolveFilename(file, module)];
        const staticConfig = original_require_1.default(file);
        config.merge(staticConfig);
        config.merge(options);
        // When loading a user's config, ensure their subscribers are initialized
        const eventsOptions = config.eventManagerOptions(config);
        config.events.updateSubscriberOptions(eventsOptions);
        config.events.initializeUserSubscribers(eventsOptions);
        return config;
    }
    static getUserConfig() {
        return new conf_1.default({ projectName: "truffle" });
    }
    static getTruffleDataDirectory() {
        const conf = TruffleConfig.getUserConfig();
        return path_1.default.dirname(conf.path);
    }
}
module.exports = TruffleConfig;
//# sourceMappingURL=index.js.map