import Conf from "conf";
declare class TruffleConfig {
    [key: string]: any;
    private _deepCopy;
    private _values;
    constructor(truffleDirectory?: string, workingDirectory?: string, network?: any);
    private eventManagerOptions;
    addProp(propertyName: string, descriptor: any): void;
    normalize(obj: any): any;
    with(obj: any): TruffleConfig;
    merge(obj: any): TruffleConfig;
    static default(): TruffleConfig;
    static search(options?: any, filename?: string): string | null;
    static detect(options?: any, filename?: string): TruffleConfig;
    static load(file: string, options?: any): TruffleConfig;
    static getUserConfig(): Conf;
    static getTruffleDataDirectory(): string;
}
export = TruffleConfig;
