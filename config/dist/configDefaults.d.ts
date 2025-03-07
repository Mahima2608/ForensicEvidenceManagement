import TruffleConfig from "./";
export declare const getInitialConfig: ({ truffleDirectory, workingDirectory, network }: {
    truffleDirectory?: string | undefined;
    workingDirectory?: string | undefined;
    network?: string | undefined;
}) => {
    truffle_directory: string;
    working_directory: string;
    network: string | undefined;
    networks: {};
    verboseRpc: boolean;
    gas: null;
    gasPrice: null;
    maxFeePerGas: null;
    maxPriorityFeePerGas: null;
    type: undefined;
    from: null;
    confirmations: number;
    timeoutBlocks: number;
    production: boolean;
    skipDryRun: boolean;
    build: null;
    resolver: null;
    artifactor: null;
    ethpm: {
        ipfs_host: string;
        ipfs_protocol: string;
        registry: string;
        install_provider_uri: string;
    };
    ens: {
        enabled: boolean;
        registryAddress: null;
    };
    mocha: {
        bail: boolean;
        grep: null;
    };
    compilers: {
        solc: {
            settings: {
                optimizer: {
                    enabled: boolean;
                    runs: number;
                };
                remappings: never[];
            };
        };
        vyper: {
            settings: {};
        };
    };
    console: {
        require: null;
    };
    logger: Console;
};
export declare const configProps: ({ configObject }: {
    configObject: TruffleConfig;
}) => {
    truffle_directory(): void;
    working_directory(): void;
    network(): void;
    networks(): void;
    verboseRpc(): void;
    build(): void;
    resolver(): void;
    artifactor(): void;
    ethpm(): void;
    logger(): void;
    compilers(): void;
    ens(): void;
    console(): void;
    mocha(): void;
    build_directory: {
        default: () => string;
        transform: (value: string) => string;
    };
    contracts_directory: {
        default: () => string;
        transform: (value: string) => string;
    };
    contracts_build_directory: {
        default: () => string;
        transform: (value: string) => string;
    };
    migrations_directory: {
        default: () => string;
        transform: (value: string) => string;
    };
    migrations_file_extension_regexp(): RegExp;
    test_directory: {
        default: () => string;
        transform: (value: string) => string;
    };
    test_file_extension_regexp(): RegExp;
    example_project_directory: {
        default: () => string;
        transform: (value: string) => string;
    };
    network_id: {
        get(): any;
        set(): never;
    };
    network_config: {
        get(): any;
        set(): never;
    };
    from: {
        get(): any;
        set(): never;
    };
    gas: {
        get(): any;
        set(): never;
    };
    gasPrice: {
        get(): any;
        set(): never;
    };
    maxFeePerGas: {
        get(): any;
        set(): never;
    };
    maxPriorityFeePerGas: {
        get(): any;
        set(): never;
    };
    type: {
        get(): any;
        set(): never;
    };
    provider: {
        get(): any;
        set(): never;
    };
    confirmations: {
        get(): any;
        set(): never;
    };
    production: {
        get(): any;
        set(): never;
    };
    timeoutBlocks: {
        get(): any;
        set(): never;
    };
};
