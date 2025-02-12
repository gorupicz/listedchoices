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
        if (!credentials.email || !credentials.password) {
          console.error('Error 400: Missing email or password');
          return Promise.reject(new Error('Missing email or password'));
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              username: true,
              password: true,
              email: true,
              phone_number: true,
              role: true,
              created_at: true,
              updated_at: true,
              first_name: true,
              last_name: true,
              biography: true,
              facebook: true,
              instagram: true,
              linkedin: true,
              photograph: true,
              isVerified: true,
              verificationCode: true,
              phoneVerificationSID: true,
              phoneIsVerified: true,
              idIsVerified: true,
              idPhotograph: true,
              accounts: true,
              properties: true,
              propertyFollowRequests: true,
              propertyFollowRequestHistories: true,
              reviews: true,
              sessions: true,
              bought_shares: true,
              sold_shares: true,
              userFollowRequests: true,
              userFollowTargets: true,
              userFollowRequestHistories: true,
              _count: true
            },
          });

          if (!user) {
            console.error('Error 401: User not found');
            return Promise.reject(new Error('User not found'));
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.error('Error 402: Invalid password');
            return Promise.reject(new Error('Invalid password'));
          }

          if (user.isVerified) {
            return {
              ...user,
            };
          } else {
            console.error('Error: Email not verified');
            return Promise.reject(new Error('Email not verified'));
          }
        } catch (error) {
          console.error('Authorization error:', error);
          return Promise.reject(new Error('Authorization error'));
        }
      }
    })
  ],
  adapter: PrismaAdapter(prisma),

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'facebook') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { photograph: true, isVerified: true },
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
      session.user = { ...token };
      console.log('Session:', session);
      return session;
    },

    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id;
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.phoneIsVerified = user.phoneIsVerified;
        token.idPhotograph = user.idPhotograph;
        token.idIsVerified = user.idIsVerified;
        token.account = account;
      }
      console.log('JWT token:', token);
      return token;
    },
  },

  session: {
    strategy: 'jwt',
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: false,
  },

  secret: process.env.NEXTAUTH_SECRET,
});
