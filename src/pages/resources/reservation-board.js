import { useEffect } from 'react';
import { useOGMetadata } from '@/context/OGMetadataContext';

export default function ReservationBoard() {
  const { setMetadata } = useOGMetadata();

  useEffect(() => {
    setMetadata({
      title: 'Join Our WhatsApp Group',
      description: 'Connect with us on WhatsApp for the latest updates and discussions.',
      ogTitle: 'Join Our WhatsApp Group',
      ogUrl: 'https://yourdomain.com/resources/reservation-board',
      ogDescription: 'Connect with us on WhatsApp for the latest updates and discussions.',
      ogImage: 'https://example.com/your-image.jpg',
    });
  }, [setMetadata]);

  useEffect(() => {
    // Redirect to WhatsApp group after the page loads
    window.location.href = 'https://chat.whatsapp.com/FoJEJQG7AivBGSNhtcB83S';
  }, []);

  return (
    <>
      <p>Redirecting to WhatsApp...</p>
    </>
  );
}