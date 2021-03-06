import './env';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';

import createSchema from '../schema';
import createSession from '../session';

const port = process.env.PORT || 8000;

async function createServer() {
    try {
        // 1. create mongoose connection
        await createSession();
        // 2. create express server
        const app = express();

        const corsOptions = {
            origin: 'hhtp://localhost:3000',
            credentials: true
        };

        app.use(cors(corsOptions));

        // use JSON requests
        app.use(express.json());

        const schema = await createSchema();

        // 3. create GraphQL server
        const apolloServer = new ApolloServer({
            schema,
            context: ({ req, res }) => ({ req, res }),
            introspection: true,
            // enable playground
            playground: {
                settings: {
                    'request.credentials': 'include'
                },
            },
        });

        apolloServer.applyMiddleware({ app, cors: corsOptions });

        // start the server
        app.listen({ port }, () => {
            console.log(`Server is running at http://localhost:${port}${apolloServer.graphqlPath}`)
        });
    } catch (err) {
        console.log(err)
    }
}

createServer();