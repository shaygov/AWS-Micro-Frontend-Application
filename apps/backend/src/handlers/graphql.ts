import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import serverlessHttp from 'serverless-http'
import cors from 'cors'
import { createServer } from 'http'
import { typeDefs } from '../schema/typeDefs'
import { resolvers } from '../resolvers/resolvers'
import { context } from '../context/context'

const app = express()

const httpServer = createServer(app)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

async function startServer() {
  await server.start()
  
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return context({ event: req, context: {} })
      },
    })
  )
  
}

startServer()

// Export the Lambda handler expected by Serverless
export const handler = serverlessHttp(app)
