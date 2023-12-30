import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
    secret: 'akgyz',
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                try {
                    const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    if (response.status === 200 && response.data) {
                        let modifiedUser = {
                            ...response.data,
                            accessToken: response.data.access,
                        };
                        delete modifiedUser.access;
                        return modifiedUser;
                    } else {
                        throw new Error('The login credentials are incorrect.');
                    }
                } catch (error) {
                    throw new Error(error.response?.data?.message || 'An error occurred during the login process.');
                }
            },
        }),
    ],
    session: {
        jwt: true,
    },
    callbacks: {
        async jwt(token, modifiedUser) {
            if (modifiedUser && modifiedUser.accessToken) {
                token.accessToken = modifiedUser.accessToken;
            }
            return token;
        },
        async session(session, token) {
            if (token && token.accessToken) {
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
});
