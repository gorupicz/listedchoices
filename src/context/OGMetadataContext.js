import { createContext, useContext, useState } from 'react';

const OGMetadataContext = createContext();

export const useOGMetadata = () => useContext(OGMetadataContext);

export const OGMetadataProvider = ({ children }) => {
  const [isOGMetadataSet, setOGMetadataSet] = useState(false);

  return (
    <OGMetadataContext.Provider value={{ isOGMetadataSet, setOGMetadataSet }}>
      {children}
    </OGMetadataContext.Provider>
  );
}; 