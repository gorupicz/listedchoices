import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook'; // Import Facebook provider
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
    FacebookProvider({ // Add Facebook provider
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
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'facebook') {
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

    async session({ session, token, user }) {
      session.user.id = parseInt(token.id, 10);
      session.user.isVerified = token.isVerified;
      return session;
    },

    async jwt({ token, account, user }) {
      if (user) {
        token.id = parseInt(user.id, 10);
        token.isVerified = user.isVerified;
      }
      return token;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
});
