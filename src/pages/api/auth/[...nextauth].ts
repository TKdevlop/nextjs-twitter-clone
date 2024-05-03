// import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { encode, decode } from "next-auth/jwt";
import { clientPromise } from "@/lib/db";
import jwt from "jsonwebtoken";
export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: { encode, decode },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      options: {},
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        // const res = await fetch("/your/endpoint", {
        //   method: "POST",
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" },
        // });
        // const user = await res.json();
        // // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return user;
        // }
        // // Return null if user data could not be retrieved
        const client = await clientPromise;
        try {
          const user = await client.db("testdb").collection("users").findOne({
            name: credentials?.username,
            //hash it skipping due to time constrain
            password: credentials?.password,
          });

          return { id: "1", name: "J Smith", email: "jsmith@example.com" };
        } catch (e) {
          console.log(e);
        }
        //hash password
        return { id: "1", name: "J Smith", email: "jsmith@example.com" };
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return "/posts";
    },
    // jwt: async (token, user, account, profile, isNewUser) => {
    //   //  "user" parameter is the object received from "authorize"
    //   //  "token" is being send below to "session" callback...
    //   //  ...so we set "user" param of "token" to object from "authorize"...
    //   //  ...and return it...
    //   user && (token.user = user);
    //   return Promise.resolve(token); // ...here
    // },
    // session: async (session, user, sessionToken) => {
    //   //  "session" is current session object
    //   //  below we set "user" param of "session" to value received from "jwt" callback
    //   session.user = { Test: "Test" };
    //   return Promise.resolve(session);
    // },
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
