import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import { ObjectID } from 'mongodb';
import path from 'path';

import { UserResolver } from '../resolvers/UserResolver';
import { AuthResolver } from '../resolvers/AuthResolver';
import { StreamResolver } from '../resolvers/StreamResolver';
import { ObjectIdScalar } from './object-id.scalar';
import { TypegooseMiddleware } from '../middleware/typegoose';

// build typeGraphQL executable schem
export default async function createSchema(): Promise<GraphQLSchema> {
    const schema = await buildSchema({
        // 1. add all typescript resolvers
        resolvers: [UserResolver, AuthResolver, StreamResolver],
        emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
        // 2. use document converting midleware
        globalMiddlewares: [TypegooseMiddleware],
        // 3. use ObjectId scalar mapping
        scalarsMap: [{ type: ObjectID, scalar: ObjectIdScalar }],
        validate: false,
    });
    return schema;
}