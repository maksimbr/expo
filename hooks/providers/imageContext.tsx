import React, { createContext, useState, useContext } from 'react';

const ImageContext = createContext<any>({});

export const ImageProvider = ({ children }) => {
  const [capturedImage, setCapturedImage] = useState(null);

  return (
    <ImageContext.Provider value={{ capturedImage, setCapturedImage }}>
      {children}
    </ImageContext.Provider>
  );
};

// Custom hook for easier access to the context 
export const useImgContext = () => {
  return useContext(ImageContext);
};
