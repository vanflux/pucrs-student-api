export interface Result<T> {
    success: boolean;
    error?: any;
    data?: T;
}
export interface LoginData {
    token?: string;
}
export interface MenuAction {
    htmlName?: string;
    imagePath?: string;
    actionPath?: string;
    parentId?: string;
}
export declare class PucrsClient {
    private static BASE_URL;
    private httpClient;
    private jar;
    private token?;
    private cache;
    constructor();
    login(registry: string, password: string): Promise<Result<LoginData>>;
    loginWithToken(token: string): Promise<Result<LoginData>>;
    private authenticate;
    private menuActions;
    executeMenuAction(actionName: string): Promise<Result<string>>;
    private apiCall;
}
