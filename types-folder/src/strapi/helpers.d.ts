export declare const customRouter: (defaultRouter: any, extraRoutes?: {
    method: "POST" | "GET" | "PUT" | "DELETE";
    path: string;
    handler: string;
}[]) => {
    readonly prefix: any;
    readonly routes: any;
};
export declare const terminalBox: (text: string, length?: number) => void;
