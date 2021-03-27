import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
    @Field()
    readonly_id: ObjectId;

    @Field()
    @Property({ required: true })
    email: String;

    @Property({ required: true })
    password: String;
}

export const UserModel = getModelForClass(User);