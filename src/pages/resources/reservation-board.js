import { useEffect } from 'react';
import Head from 'next/head';

export default function Redirect() {
  useEffect(() => {
    // Redirect to WhatsApp group after the page loads
    window.location.href = 'https://chat.whatsapp.com/FoJEJQG7AivBGSNhtcB83S';
  }, []);

  return (
    <>
      <Head>
        <title>Join Our WhatsApp Group</title>
        <meta property="og:title" content="Join Our WhatsApp Group" />
        <meta property="og:description" content="Connect with us on WhatsApp for the latest updates and discussions." />
        <meta property="og:image" content="https://example.com/your-image.jpg" />
        <meta property="og:url" content="https://yourdomain.com/redirect" />
        <meta property="og:type" content="website" />
      </Head>
      <p>Redirecting to WhatsApp...</p>
    </>
  );
}