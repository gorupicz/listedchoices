import { createContext, useContext, useState } from 'react';
import metadata from '@/data/metadata.json';

const OGMetadataContext = createContext();

export const OGMetadataProvider = ({ children }) => {
  const [metadataState, setMetadata] = useState({
    title: metadata.title,
    description: metadata.description,
    ogTitle: metadata.ogTitle,
    ogUrl: metadata.ogUrl,
    ogDescription: metadata.ogDescription,
    ogImage: metadata.ogImage,
  });

  return (
    <OGMetadataContext.Provider value={{ metadata: metadataState, setMetadata }}>
      {children}
    </OGMetadataContext.Provider>
  );
};

export const useOGMetadata = () => useContext(OGMetadataContext); 