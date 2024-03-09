export declare const Rut: (rut: any) => {
    clean: () => string;
    validate: () => boolean;
    format: (options?: {
        dots: boolean;
    }) => string;
    getCheckDigit: () => string;
};
