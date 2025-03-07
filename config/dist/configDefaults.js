"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configProps = exports.getInitialConfig = void 0;
const path = __importStar(require("path"));
const provider_1 = __importDefault(require("@truffle/provider"));
const getInitialConfig = ({ truffleDirectory, workingDirectory, network }) => {
    const truffle_directory = truffleDirectory || path.resolve(path.join(__dirname, "../"));
    const working_directory = workingDirectory || process.cwd();
    return {
        truffle_directory,
        working_directory,
        network,
        networks: {},
        verboseRpc: false,
        gas: null,
        gasPrice: null,
        maxFeePerGas: null,
        maxPriorityFeePerGas: null,
        type: undefined,
        from: null,
        confirmations: 0,
        timeoutBlocks: 0,
        production: false,
        skipDryRun: false,
        build: null,
        resolver: null,
        artifactor: null,
        ethpm: {
            ipfs_host: "ipfs.infura.io",
            ipfs_protocol: "https",
            registry: "0x8011df4830b4f696cd81393997e5371b93338878",
            install_provider_uri: "https://ropsten.infura.io/v3/26e88e46be924823983710becd929f36"
        },
        ens: {
            enabled: false,
            registryAddress: null
        },
        mocha: {
            bail: false,
            grep: null
        },
        compilers: {
            solc: {
                settings: {
                    //Note: The default solc version is *not* set here!
                    //It's set in compilerSupplier/index.js in compile-solidity
                    optimizer: {
                        enabled: false,
                        runs: 200
                    },
                    remappings: []
                }
            },
            vyper: {
                settings: {}
            }
        },
        console: {
            require: null
        },
        logger: console
    };
};
exports.getInitialConfig = getInitialConfig;
const configProps = ({ configObject }) => {
    const resolveDirectory = (value) => path.resolve(configObject.working_directory, value);
    return {
        // These are already set.
        truffle_directory() { },
        working_directory() { },
        network() { },
        networks() { },
        verboseRpc() { },
        build() { },
        resolver() { },
        artifactor() { },
        ethpm() { },
        logger() { },
        compilers() { },
        ens() { },
        console() { },
        mocha() { },
        build_directory: {
            default: () => path.join(configObject.working_directory, "build"),
            transform: resolveDirectory
        },
        contracts_directory: {
            default: () => path.join(configObject.working_directory, "contracts"),
            transform: resolveDirectory
        },
        contracts_build_directory: {
            default: () => path.join(configObject.build_directory, "contracts"),
            transform: resolveDirectory
        },
        migrations_directory: {
            default: () => path.join(configObject.working_directory, "migrations"),
            transform: resolveDirectory
        },
        migrations_file_extension_regexp() {
            return /^\.(js|es6?)$/;
        },
        test_directory: {
            default: () => path.join(configObject.working_directory, "test"),
            transform: resolveDirectory
        },
        test_file_extension_regexp() {
            return /.*\.(js|ts|es|es6|jsx|sol)$/;
        },
        example_project_directory: {
            default: () => path.join(configObject.truffle_directory, "example"),
            transform: resolveDirectory
        },
        network_id: {
            get() {
                try {
                    return configObject.network_config.network_id;
                }
                catch (e) {
                    return null;
                }
            },
            set() {
                throw new Error("Do not set config.network_id. Instead, set config.networks and then config.networks[<network name>].network_id");
            }
        },
        network_config: {
            get() {
                const network = configObject.network;
                if (network === null || network === undefined) {
                    throw new Error("Network not set. Cannot determine network to use.");
                }
                let config = configObject.networks[network];
                if (config === null || config === undefined) {
                    config = {};
                }
                return config;
            },
            set() {
                throw new Error("Don't set config.network_config. Instead, set config.networks with the desired values.");
            }
        },
        from: {
            get() {
                try {
                    return configObject.network_config.from;
                }
                catch (e) {
                    return null;
                }
            },
            set() {
                throw new Error("Don't set config.from directly. Instead, set config.networks and then config.networks[<network name>].from");
            }
        },
        gas: {
            get() {
                try {
                    return configObject.network_config.gas;
                }
                catch (e) {
                    return null;
                }
            },
            set() {
                throw new Error("Don't set config.gas directly. Instead, set config.networks and then config.networks[<network name>].gas");
            }
        },
        gasPrice: {
            get() {
                try {
                    return configObject.network_config.gasPrice;
                }
                catch (e) {
                    return null;
                }
            },
            set() {
                throw new Error("Don't set config.gasPrice directly. Instead, set config.networks and then config.networks[<network name>].gasPrice");
            }
        },
        maxFeePerGas: {
            get() {
                try {
                    return configObject.network_config.maxFeePerGas;
                }
                catch (e) {
                    return null;
                }
            },
            set() {
                throw new Error("Don't set config.maxFeePerGas directly. Instead, set config.networks and then config.networks[<network name>].maxFeePerGas");
            }
        },
        maxPriorityFeePerGas: {
            get() {
                try {
                    return configObject.network_config.maxPriorityFeePerGas;
                }
                catch (e) {
                    return null;
                }
            },
            set() {
                throw new Error("Don't set config.maxPriorityFeePerGas directly. Instead, set config.networks and then config.networks[<network name>].maxPriorityFeePerGas");
            }
        },
        type: {
            get() {
                try {
                    return configObject.network_config.type;
                }
                catch (e) {
                    return null;
                }
            },
            set() {
                throw new Error("Don't set config.type directly. Instead, set config.networks and then config.networks[<network name>].type");
            }
        },
        provider: {
            get() {
                if (!configObject.network) {
                    return null;
                }
                const options = configObject.network_config;
                options.verboseRpc = configObject.verboseRpc;
                return provider_1.default.create(options);
            },
            set() {
                throw new Error("Don't set config.provider directly. Instead, set config.networks and then set config.networks[<network name>].provider");
            }
        },
        confirmations: {
            get() {
                try {
                    return configObject.network_config.confirmations;
                }
                catch (e) {
                    return 0;
                }
            },
            set() {
                throw new Error("Don't set config.confirmations directly. Instead, set config.networks and then config.networks[<network name>].confirmations");
            }
        },
        production: {
            get() {
                try {
                    return configObject.network_config.production;
                }
                catch (e) {
                    return false;
                }
            },
            set() {
                throw new Error("Don't set config.production directly. Instead, set config.networks and then config.networks[<network name>].production");
            }
        },
        timeoutBlocks: {
            get() {
                try {
                    return configObject.network_config.timeoutBlocks;
                }
                catch (e) {
                    return 0;
                }
            },
            set() {
                throw new Error("Don't set config.timeoutBlocks directly. Instead, set config.networks and then config.networks[<network name>].timeoutBlocks");
            }
        }
    };
};
exports.configProps = configProps;
//# sourceMappingURL=configDefaults.js.map