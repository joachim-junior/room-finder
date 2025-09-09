import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithPlaceholderProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string;
  alt: string;
  fallbackSrc?: string;
}

export const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  src,
  alt,
  className = "",
  fallbackSrc,
  ...imageProps
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if using fill prop
  const usingFill = "fill" in imageProps;

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Helper function to validate URL
  const isValidUrl = (url: string): boolean => {
    if (!url || typeof url !== "string") return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // If there's an error and we have a fallback, use it
  if (hasError && fallbackSrc && isValidUrl(fallbackSrc)) {
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        className={className}
        onError={() => {
          // If fallback also fails, show a simple placeholder
          setHasError(true);
        }}
        {...imageProps}
      />
    );
  }

  // If there's an error, no fallback, or invalid URL, show a simple placeholder
  if (hasError || !src || !isValidUrl(src)) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center w-full h-full`}
      >
        <svg
          className="w-12 h-12 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  // If using fill prop, don't wrap in container div
  if (usingFill) {
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        )}
        <Image
          src={src}
          alt={alt}
          className={`${className} ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          onError={handleError}
          onLoad={handleLoad}
          {...imageProps}
        />
      </>
    );
  }

  // For non-fill images, use container div
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={500}
        height={300}
        className={`${className} $
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        {...imageProps}
      />
    </div>
  );
};
