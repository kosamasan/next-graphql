import { useState, useContext, createContext, useEffect } from 'react';
import { from, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';

import { useSigninMutation } from 'lib/graphql/signin.graphql';
import { useSignupMutation } from 'lib/graphql/signup.graphql';
import { useCurrentUserQuery } from 'lib/graphql/currentUser.graphql';

type AuthProps = {
    user: any;
    error: string;
    signIn: (email: any, password: any) => Promise<void>;
    signUp: (email: any, password: any) => Promise<void>;
    signOut: () => void;
}

// the partial declaration makes all the properties optional and allows to initialize context with an empty object
const AuthContext = createContext<Partial<AuthProps>>({});

// You can wrap your _app.tsx with this provider
export function AuthProvider({ children }) {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
};

// custom react hook to access the context
export const useAuth = () => {
    return useContext(AuthContext);
};

function useProvideAuth() {
    const client = useApolloClient();
    const router = useRouter();

    const [error, setError] = useState('');
    const { data } = useCurrentUserQuery({
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
    });
    const user = data && data.currentUser;

    // Signining in and Signing up
    const [signInMutation] = useSigninMutation();
    const [signUpMutation] = useSignupMutation();

    const signIn = async (email, password) => {
        try {
            const { data } = await signInMutation({ variables: { email, password } });
            if (data.login.token && data.login.user) {
                sessionStorage.setItem('token', data.login.token);
                client.resetStore().then(() => {
                    router.push("/");
                })
            } else {
                setError('Invalid login');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const signUp = async (email, password) => {
        try {
            const { data } = await signUpMutation({ variables: { email, password } });
            if (data.register.token && data.register.user) {
                sessionStorage.setItem('token', data.register.token);
                client.resetStore().then(() => {
                    router.push("/");
                })
            } else {
                setError('Invalid login');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const signOut = () => {
        sessionStorage.removeItem('token');
        client.resetStore().then(() => {
            router.push('/');
        });
    };

    return {
        user,
        error,
        signIn,
        signUp,
        signOut,
    };
}