export declare class DashboardService {
    private tableName;
    getDashboardStats(): Promise<Record<string, any> | {
        totalUsers: number;
        activeUsers: number;
        totalOrders: number;
        revenue: number;
    }>;
    getDashboardStatsByUser(userId: string): Promise<Record<string, any> | {
        totalUsers: number;
        activeUsers: number;
        totalOrders: number;
        revenue: number;
    }>;
    updateStats(stats: any): Promise<void>;
    incrementUserCount(): Promise<void>;
    decrementUserCount(): Promise<void>;
}
//# sourceMappingURL=DashboardService.d.ts.map