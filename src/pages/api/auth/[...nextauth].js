import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials'; // Import Credentials provider
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs'; // Import bcrypt for password comparison
import emailData from '@/data/emails.json';
import { sendEmail } from '@/lib/mailer';

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
        console.log('Authorize function called');
        console.log('Received credentials:', credentials);

        if (!credentials.email || !credentials.password) {
          console.error('Missing email or password');
          return null;
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              password: true,
              isVerified: true,
              photograph: true,
              first_name: true,
              email: true,
              phoneIsVerified: true,
            },
          });

          console.log('User found:', user);

          if (!user) {
            console.error('No user found with the given email');
            return null;  
          }

          // Check if the password is correct
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.error('Invalid password');
            return null;
          }

          if (user && isPasswordValid && user.isVerified) {
            console.log('User is verified and authenticated');
            return {
              id: user.id,
              isVerified: user.isVerified,
              photograph: user.photograph,
              first_name: user.first_name,
              email: user.email,
              phoneIsVerified: user.phoneIsVerified,
            };
          } else {
            console.error('User is not verified');
            return null;
          }
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      }
    })
  ],
  adapter: PrismaAdapter(prisma),

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.isVerified) {
        throw new Error('203');
      }
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
      session.user.phoneIsVerified = token.phoneIsVerified;
      session.user.idVerificationInProgress = token.idVerificationInProgress;
      return session;
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.photograph = user.photograph;
        token.first_name = user.first_name;
        token.phoneIsVerified = user.phoneIsVerified;
      }

      // Update token with new information
      if (user?.idVerificationInProgress !== undefined) {
        token.idVerificationInProgress = user.idVerificationInProgress;
      }

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
