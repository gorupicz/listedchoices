import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function testUserAuthentication(email, password) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('No user found with the given email');
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('Invalid password');
      return;
    }

    console.log('User authenticated successfully:', user);
  } catch (error) {
    console.error('Error during authentication test:', error);
  }
}

testUserAuthentication('test@example.com', 'yourpassword'); 