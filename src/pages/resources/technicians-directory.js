import { useEffect, useState } from 'react';
import { useOGMetadata } from '@/context/OGMetadataContext';

export default function ReservationBoard() {
  const { setMetadata } = useOGMetadata();
  const [isMetadataSet, setIsMetadataSet] = useState(false);

  useEffect(() => {
    setMetadata({
      title: 'Join Our WhatsApp Group',
      description: 'Connect with us on WhatsApp for the latest updates and discussions.',
      ogTitle: 'Join Our WhatsApp Group',
      ogUrl: 'https://bolsadecasas.mx/resources/technicians-directory',
      ogDescription: 'Connect with us on WhatsApp for the latest updates and discussions.',
      ogImage: 'https://example.com/your-image.jpg',
    });
    setIsMetadataSet(true);
  }, [setMetadata]);

  useEffect(() => {
    if (isMetadataSet) {
      window.location.href = 'https://airtable.com/apphnoXp99CJZbH7G/shrkkLjsUqgy7M6oq';
    }
  }, [isMetadataSet]);

  if (!isMetadataSet) {
    return null;
  }

  return (
    <>
      <p>Redirecting to Airtable...</p>
    </>
  );
}