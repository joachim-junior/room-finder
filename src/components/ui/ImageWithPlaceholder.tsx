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

  // Debug logging
  console.log("ImageWithPlaceholder:", {
    src,
    alt,
    hasError,
    isLoading,
    className,
    imageProps,
  });

  const handleError = () => {
    console.error("Image failed to load:", src);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log("Image loaded successfully:", src);
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
    console.log("Showing placeholder because:", {
      hasError,
      src,
      isValidUrl: src ? isValidUrl(src) : false,
    });
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

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      style={{ display: isLoading ? "none" : "block" }}
      {...imageProps}
    />
  );
};
