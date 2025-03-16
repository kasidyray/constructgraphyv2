import React, { useState, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  fallbackSrc?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  className = '',
  fallbackSrc = '/images/placeholder.svg',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setError(false);
    setImgSrc(placeholderSrc || src);
  }, [src, placeholderSrc]);

  const handleLoad = () => {
    // If we're using a placeholder, switch to the real image once loaded
    if (placeholderSrc && imgSrc === placeholderSrc) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImgSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setError(true);
        setImgSrc(fallbackSrc);
      };
    } else {
      setIsLoaded(true);
    }
  };

  const handleError = () => {
    setError(true);
    setImgSrc(fallbackSrc);
  };

  return (
    <img
      src={error ? fallbackSrc : imgSrc}
      alt={alt}
      loading="lazy"
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
};

export default LazyImage; 