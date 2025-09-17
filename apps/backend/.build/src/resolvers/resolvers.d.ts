export declare const resolvers: {
    Query: {
        users: () => Promise<{
            id: any;
            name: any;
            email: any;
            status: any;
            createdAt: any;
            updatedAt: any;
        }[]>;
        user: (_: any, { id }: {
            id: string;
        }) => Promise<{
            id: string;
            name: any;
            email: any;
            createdAt: any;
            updatedAt: any;
            status: any;
        } | null>;
        dashboardStats: () => Promise<Record<string, any> | {
            totalUsers: number;
            activeUsers: number;
            totalOrders: number;
            revenue: number;
        }>;
        usersWithDashboard: () => Promise<{
            users: {
                id: any;
                name: any;
                email: any;
                status: any;
                createdAt: any;
                updatedAt: any;
            }[];
            dashboard: Record<string, any> | {
                totalUsers: number;
                activeUsers: number;
                totalOrders: number;
                revenue: number;
            };
        }>;
    };
    Mutation: {
        createUser: (_: any, { input }: {
            input: any;
        }) => Promise<{
            id: string;
            name: string;
            email: string;
            status: string;
            createdAt: string;
            updatedAt: string;
        }>;
        updateUser: (_: any, { id, input }: {
            id: string;
            input: any;
        }) => Promise<{
            id: string;
            name: any;
            email: any;
            createdAt: any;
            updatedAt: any;
            status: any;
        }>;
        deleteUser: (_: any, { id }: {
            id: string;
        }) => Promise<boolean>;
    };
    User: {
        dashboard: (parent: any) => Promise<Record<string, any> | {
            totalUsers: number;
            activeUsers: number;
            totalOrders: number;
            revenue: number;
        }>;
    };
};
//# sourceMappingURL=resolvers.d.ts.map