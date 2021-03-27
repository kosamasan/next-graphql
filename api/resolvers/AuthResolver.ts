import { Arg, Mutation, Resolver } from 'type-graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { UserModel } from '../entity/User';
import { AuthInput } from '../types/AuthInput';
import { UserResponse } from '../types/UserResponse';

@Resolver()
export class AuthResolver {
    @Mutation(() => UserResponse)
    async register(@Arg('input') { email, password }: AuthInput): Promise<UserResponse> {
        // check for existing email
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Error('Email exists');
        }

        // create a newuser with hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ email, password: hashedPassword });
        await user.save();

        // store user id on the token payload
        const payload = {
            id: user.id
        }

        const token = jwt.sign(payload, process.env.SESSION_SECRET || 'qwe!@#QWE');

        return { user, token };
    }

    @Mutation(() => UserResponse)
    async login(@Arg('input') { email, password }: AuthInput): Promise<UserResponse> {
        // check for existing email
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            throw new Error('Invalid');
        }

        // check if password is valid
        const valid = await bcrypt.compare(password, existingUser.password);
        if (!valid) {
            throw new Error('Invalid');
        }

        // store user id on the token payload
        const payload = {
            id: existingUser.id
        }

        const token = jwt.sign(payload, process.env.SESSION_SECRET || 'qwe!@#QWE');

        return { user: existingUser, token };
    }
}