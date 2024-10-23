import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

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
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
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
              first_name: profile.given_name,
              last_name: profile.family_name,
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

    async session({ session, token, user }) {
      // Ensure the `id` is converted to an integer
      session.user.id = parseInt(token.id, 10); // Fixing issue with user.id not being available in session
      session.user.isVerified = token.isVerified; // Ensure isVerified is included in session
      return session;
    },

    async jwt({ token, account, user }) {
      if (user) {
        token.id = parseInt(user.id, 10);
        token.isVerified = user.isVerified; // Ensure isVerified is included in token
      }
      return token;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
});