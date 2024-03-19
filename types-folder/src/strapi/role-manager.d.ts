export declare class RoleManager {
    strapi: any;
    roleId: number;
    role: any;
    roleName: any;
    constructor(strapi: any);
    FindRole(name: string): Promise<boolean>;
    SetRole(name: string): Promise<boolean>;
    FindOrCreateRole(name: string, description: string): Promise<void>;
    SetPermissionState(controller: any, permission: any, state: any, type?: string, service?: any): Promise<void>;
    SetSuperUser(): Promise<void>;
    Save(): Promise<void>;
}
