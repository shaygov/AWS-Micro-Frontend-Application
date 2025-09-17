import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers/resolvers';
import { context } from './context/context';
import { createServer } from 'http';
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;
// Set NODE_ENV for local development
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}
async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        introspection: true,
    });
    await server.start();
    app.use('/graphql', cors(), express.json(), expressMiddleware(server, {
        context: async ({ req }) => {
            return context({ event: req, context: {} });
        },
    }));
    app.get('/health', (req, res) => {
        res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
}
startServer().catch((error) => {
    console.error('Error starting server:', error);
});
//# sourceMappingURL=server.js.map