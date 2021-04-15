import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Field, ObjectType } from 'type-graphql';
import { User } from './User';
import { Ref } from '../types/Ref';

@ObjectType({ description: 'Stream embedded post content' })
export class Stream {
    @Field()
    readonly id: ObjectId;

    @Field()
    @Property({ required: true })
    title: String;

    @Field()
    @Property({ required: true })
    description: String;

    @Field()
    @Property({ required: true })
    url: String;

    @Field(() => User)
    @Property({ ref: User, required: true })
    author: Ref<User>;
}

export const StreamModel = getModelForClass(Stream);