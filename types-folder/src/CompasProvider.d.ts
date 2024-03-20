type ICompasConfig = {
    url: string;
    develUrl?: string;
    api: (data: any) => Promise<any>;
    apiCustomRootPath?: string;
    compasF7?: any;
    colors?: {
        blue: string;
    };
};
declare class Compas {
    url: string | (() => string);
    develUrl: string;
    api: any;
    apiCustomRootPath?: string;
    colors: {
        blue: string;
    };
    compasF7: any;
    init(config: ICompasConfig): void;
}
export declare const CompasProvider: Compas;
export {};
