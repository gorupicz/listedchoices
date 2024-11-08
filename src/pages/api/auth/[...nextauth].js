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
        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.error('No user found with the given email');
            return null;
          }

          // Check if the password is correct
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            return null;
          }

          if (!user.isVerified) {
            try {
              // Generate a verification code if not provided in the request
              const code = Math.floor(100000 + Math.random() * 900000).toString();

              // Update the user's verification code in the database
              await prisma.user.update({
                where: { email },
                data: { verificationCode: code },
              });

              // Send verification email
              await sendEmail({
                to: email,
                subject: emailData.verificationEmailSubject.replace('{code}', code),
                body: emailData.verificationEmailBody.replace('{code}', code),  // Format the email body
              });

              return { message: emailData.verificationEmailInternalMessageEmailSentOK, isVerified: false };
            } catch (emailError) {
              return { message: emailData.verificationEmailInternalMessageEmailNotSent, isVerified: false };
            }
          }

          // Return user object with necessary properties
          return {
            id: user.id,
            isVerified: user.isVerified,
            photograph: user.photograph,
            first_name: user.first_name,
            email: user.email
          };
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
      if (session.user && token) {
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.photograph = token.photograph;
        session.user.first_name = token.first_name;
        session.user.email = token.email;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.photograph = user.photograph;
        token.first_name = user.first_name;
        token.email = user.email;
      }
      return token;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
});
