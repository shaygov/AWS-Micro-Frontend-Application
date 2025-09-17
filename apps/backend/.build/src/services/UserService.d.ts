export declare class UserService {
    private tableName;
    getAllUsers(): Promise<{
        id: any;
        name: any;
        email: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    getUserById(id: string): Promise<{
        id: string;
        name: any;
        email: any;
        createdAt: any;
        updatedAt: any;
        status: any;
    } | null>;
    createUser(input: {
        name: string;
        email: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    }>;
    updateUser(id: string, input: {
        name?: string;
        email?: string;
        status?: string;
    }): Promise<{
        id: string;
        name: any;
        email: any;
        createdAt: any;
        updatedAt: any;
        status: any;
    }>;
    deleteUser(id: string): Promise<boolean>;
    getUserByEmail(email: string): Promise<{
        id: any;
        name: any;
        email: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    } | null>;
}
//# sourceMappingURL=UserService.d.ts.map