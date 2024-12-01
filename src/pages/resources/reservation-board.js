import { useEffect, useState } from 'react';
import { useOGMetadata } from '@/context/OGMetadataContext';

export default function ReservationBoard() {
  const { setMetadata } = useOGMetadata();
  const [isMetadataSet, setIsMetadataSet] = useState(false);

  useEffect(() => {
    console.log('Setting metadata for reservation board');
    setMetadata({
      title: 'Join Our WhatsApp Group',
      description: 'Connect with us on WhatsApp for the latest updates and discussions.',
      ogTitle: 'Join Our WhatsApp Group',
      ogUrl: 'https://yourdomain.com/resources/reservation-board',
      ogDescription: 'Connect with us on WhatsApp for the latest updates and discussions.',
      ogImage: 'https://example.com/your-image.jpg',
    });
    setIsMetadataSet(true);
  }, [setMetadata]);

  useEffect(() => {
    if (isMetadataSet) {
      window.location.href = 'https://chat.whatsapp.com/FoJEJQG7AivBGSNhtcB83S';
    }
  }, [isMetadataSet]);

  if (!isMetadataSet) {
    return null;
  }

  return (
    <>
      <p>Redirecting to WhatsApp...</p>
    </>
  );
}