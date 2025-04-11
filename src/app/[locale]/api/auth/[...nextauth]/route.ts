import NextAuth, {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import { OAuth2Client } from 'google-auth-library';
import {checkAndSaveUser, getUserByEmail} from "~/servers/user";
import {headers} from "next/headers";

const googleAuthClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID
    }),
    // connect with google api internally
    CredentialsProvider({
      // We will use this id later to specify for what Provider we want to trigger the signIn method
      id: "googleonetap",
      name: "google-one-tap",
      // This means that the authentication will be done through a single credential called 'credential'
      credentials: {
        credential: { type: "text" },
      },
      // @ts-ignore
      authorize: async (credentials) => {
        // These next few lines are simply the recommended way to use the Google Auth Javascript API as seen in the Google Auth docs
        // What is going to happen is that t he Google One Tap UI will make an API call to Google and return a token associated with the user account
        // This token is then passed to the authorize function and used to retrieve the customer information (payload).
        // If this doesn't make sense yet, come back to it after having seen the custom hook.

        const token = credentials!.credential;
        const ticket = await googleAuthClient.verifyIdToken({
          idToken: token,
          audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
          throw new Error("Cannot extract payload from signin token");
        }
        const { email, name, picture: image } = payload;
        if (!email) {
          throw new Error("Email not available");
        }
        const user = {email, name, image}
        const headerAll = headers();
        const userIp = headerAll.get("x-forwarded-for");
        await checkAndSaveUser(user.name, user.email, user.image, userIp);
        return user
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  callbacks: {
    async signIn({user, account, profile, email, credentials}) {
      const headerAll = headers();
      const userIp = headerAll.get("x-forwarded-for");
      await checkAndSaveUser(user.name, user.email, user.image, userIp);
      return true
    },
    async redirect({url, baseUrl}) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async session({session}) {
      if (session) {
        const email = session?.user?.email;
        if (email) {
          session.user = await getUserByEmail(email);
          return session;
        }
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
