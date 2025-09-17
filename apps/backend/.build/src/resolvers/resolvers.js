import { UserService } from '../services/UserService';
import { DashboardService } from '../services/DashboardService';
const userService = new UserService();
const dashboardService = new DashboardService();
export const resolvers = {
    Query: {
        users: async () => {
            return await userService.getAllUsers();
        },
        user: async (_, { id }) => {
            return await userService.getUserById(id);
        },
        dashboardStats: async () => {
            return await dashboardService.getDashboardStats();
        },
        usersWithDashboard: async () => {
            const [users, dashboard] = await Promise.all([
                userService.getAllUsers(),
                dashboardService.getDashboardStats(),
            ]);
            return { users, dashboard };
        },
    },
    Mutation: {
        createUser: async (_, { input }) => {
            return await userService.createUser(input);
        },
        updateUser: async (_, { id, input }) => {
            return await userService.updateUser(id, input);
        },
        deleteUser: async (_, { id }) => {
            return await userService.deleteUser(id);
        },
    },
    User: {
        dashboard: async (parent) => {
            return await dashboardService.getDashboardStatsByUser(parent.id);
        },
    },
};
//# sourceMappingURL=resolvers.js.map