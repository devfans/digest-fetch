export class DigestClient {
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
    getClient(): Promise<typeof fetch | typeof import("node-fetch").default>;
    _client: typeof import("node-fetch").default;
    fetch(url: any, options?: {}): Promise<Response | import("node-fetch").Response>;
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
export default DigestClient;
