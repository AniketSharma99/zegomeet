// ZPContext.js
import React from 'react';

export const ZPContext = React.createContext();

export const ZPProvider = ({ children }) => {
  const [zp, setZP] = React.useState(null);

  return (
    <ZPContext.Provider value={{ zp, setZP }}>
      {children}
    </ZPContext.Provider>
  );
};
