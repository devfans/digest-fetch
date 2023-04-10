export = DigestClient;
declare class DigestClient {
    static parse(...args: any[]): string;
    constructor(user: any, password: any, options?: {});
    user: any;
    hashFunc: any;
    password: any;
    nonceRaw: string;
    logger: any;
    precomputedHash: any;
    digest: {
        nc: number;
        algorithm: any;
        realm: string;
    };
    hasAuth: boolean;
    cnonceSize: number;
    statusCode: any;
    basic: any;
    fetch(url: any, options?: {}): Promise<any>;
    addBasicAuth(options?: {}): {
        headers: {
            Authorization: string;
        };
    };
    computeHash(user: any, realm: any, password: any): any;
    hashWithAlgorithm(data: any): any;
    addAuth(url: any, options: any): any;
    parseAuth(h: any): void;
    lastAuth: any;
    parseQop(rawAuth: any): "auth" | "auth-int";
    makeNonce(): string;
}
