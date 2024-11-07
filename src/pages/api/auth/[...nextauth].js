import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials'; // Import Credentials provider
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs'; // Import bcrypt for password comparison

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          image: profile.picture.data.url,
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Authorizing user with email:', credentials.email);

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.error('No user found with the given email');
          return null; // Return null if no user is found
        }

        // Check if the password is correct
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          console.error('Invalid password');
          return null; // Return null if password is invalid
        }

        console.log('User authenticated successfully:', user);

        // Return user object with necessary properties
        return {
          id: user.id,
          email: user.email,
          isVerified: user.isVerified,
          photograph: user.photograph,
          first_name: user.first_name
        };
      }
    })
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'facebook') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { photograph: true },
        });

        if (existingUser) {
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
              },
            });
          }

          if (!existingUser.photograph) {
            await prisma.user.update({
              where: { email: user.email },
              data: {
                photograph: profile.picture,
              },
            });
          }
          if (!existingUser.isVerified) {
            await prisma.user.update({
              where: { email: user.email },
              data: {
                isVerified: true,
              },
            });
          }
        } else {
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              first_name: profile.given_name || profile.first_name,
              last_name: profile.family_name || profile.last_name,
              photograph: profile.picture,
              password: null,
              isVerified: true,
            },
          });

          await prisma.account.create({
            data: {
              userId: newUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
            },
          });
        }
      }
      return true;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.isVerified = token.isVerified;
      session.user.photograph = token.photograph;
      session.user.first_name = token.first_name;
      console.log('Session:', session); // Debugging log
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.photograph = user.photograph;
        token.first_name = user.first_name;
      }
      console.log('JWT Token:', token); // Debugging log
      return token;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
});
