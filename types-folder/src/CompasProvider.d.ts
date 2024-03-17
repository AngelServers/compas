type ICompasConfig = {
    url: string;
    develUrl?: string;
    api: (data: any) => Promise<any>;
    compasF7?: any;
    colors?: {
        blue: string;
    };
};
declare class Compas {
    url: string | (() => string);
    develUrl: string;
    api: any;
    colors: {
        blue: string;
    };
    compasF7: any;
    init(config: ICompasConfig): void;
}
export declare const CompasProvider: Compas;
export {};
