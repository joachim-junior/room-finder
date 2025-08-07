import Image from "next/image";
import { useState } from "react";

const MediaGallery = ({ gallery }: { gallery?: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);

  const images =
    Array.isArray(gallery) && gallery.length > 0
      ? gallery
      : ["/assets/images/media/no_image.jpg"];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.log(`Gallery image failed to load: ${target.src}`);
    target.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==";
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowFullGallery(false);
    } else if (e.key === "ArrowRight") {
      nextImage();
    } else if (e.key === "ArrowLeft") {
      prevImage();
    }
  };

  return (
    <>
      <div style={{ marginBottom: "48px" }}>
        {/* Desktop Layout - Main Image Left, Gallery Right */}
        <div className="d-none d-lg-block">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "8px",
              height: "450px",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Main Large Image */}
            <div
              style={{
                position: "relative",
                height: "100%",
                backgroundColor: "#f8f9fa",
              }}
            >
              <Image
                src={
                  images[selectedImage]?.startsWith("http")
                    ? images[selectedImage]
                    : `https://cpanel.roomfinder237.com/${images[selectedImage]}`
                }
                alt={`Property image ${selectedImage + 1}`}
                fill
                style={{
                  objectFit: "cover",
                }}
                onError={handleImageError}
                unoptimized={true}
              />

              {/* Show all photos button */}
              {images.length > 5 && (
                <button
                  onClick={() => setShowFullGallery(true)}
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    backgroundColor: "rgba(0,0,0,0.8)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  Show all {images.length} photos
                </button>
              )}
            </div>

            {/* Thumbnail Gallery - Right Side (Vertical Layout) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {images.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: "1",
                    position: "relative",
                    backgroundColor: "#f8f9fa",
                    cursor: "pointer",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border:
                      selectedImage === idx
                        ? "2px solid #007bff"
                        : "2px solid transparent",
                  }}
                  onClick={() => setSelectedImage(idx)}
                >
                  <Image
                    src={
                      img.startsWith("http")
                        ? img
                        : `https://cpanel.roomfinder237.com/${img}`
                    }
                    alt={`Property thumbnail ${idx + 1}`}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    onError={handleImageError}
                    unoptimized={true}
                  />

                  {/* Overlay for last image if there are more than 4 images */}
                  {idx === 3 && images.length > 4 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      +{images.length - 4} more
                    </div>
                  )}
                </div>
              ))}

              {/* Fill remaining slots if less than 4 images */}
              {Array.from({ length: Math.max(0, 4 - images.length) }).map(
                (_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    style={{
                      flex: "1",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#717171",
                      fontSize: "12px",
                    }}
                  >
                    No image
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout - Main Image Top, Gallery Bottom */}
        <div className="d-block d-lg-none">
          {/* Main Large Image */}
          <div
            style={{
              position: "relative",
              height: "300px",
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <Image
              src={
                images[selectedImage]?.startsWith("http")
                  ? images[selectedImage]
                  : `https://cpanel.roomfinder237.com/${images[selectedImage]}`
              }
              alt={`Property image ${selectedImage + 1}`}
              fill
              style={{
                objectFit: "cover",
              }}
              onError={handleImageError}
              unoptimized={true}
            />

            {/* Show all photos button */}
            {images.length > 5 && (
              <button
                onClick={() => setShowFullGallery(true)}
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "16px",
                  backgroundColor: "rgba(0,0,0,0.8)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                }}
              >
                Show all {images.length} photos
              </button>
            )}
          </div>

          {/* Thumbnail Gallery - Below Main Image */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
            }}
          >
            {images.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  height: "80px",
                  backgroundColor: "#f8f9fa",
                  cursor: "pointer",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border:
                    selectedImage === idx
                      ? "2px solid #007bff"
                      : "2px solid transparent",
                }}
                onClick={() => setSelectedImage(idx)}
              >
                <Image
                  src={
                    img.startsWith("http")
                      ? img
                      : `https://cpanel.roomfinder237.com/${img}`
                  }
                  alt={`Property thumbnail ${idx + 1}`}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                  onError={handleImageError}
                  unoptimized={true}
                />

                {/* Overlay for last image if there are more than 4 images */}
                {idx === 3 && images.length > 4 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    +{images.length - 4} more
                  </div>
                )}
              </div>
            ))}

            {/* Fill remaining slots if less than 4 images */}
            {Array.from({ length: Math.max(0, 4 - images.length) }).map(
              (_, idx) => (
                <div
                  key={`empty-${idx}`}
                  style={{
                    height: "80px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#717171",
                    fontSize: "12px",
                  }}
                >
                  No image
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showFullGallery && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              color: "#ffffff",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: "600" }}>
              {selectedImage + 1} of {images.length}
            </div>
            <button
              onClick={() => setShowFullGallery(false)}
              style={{
                background: "none",
                border: "none",
                color: "#ffffff",
                fontSize: "24px",
                cursor: "pointer",
                padding: "8px",
              }}
            >
              ×
            </button>
          </div>

          {/* Main Image Display */}
          <div
            style={{
              flex: "1",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={
                images[selectedImage]?.startsWith("http")
                  ? images[selectedImage]
                  : `https://cpanel.roomfinder237.com/${images[selectedImage]}`
              }
              alt={`Property image ${selectedImage + 1}`}
              width={800}
              height={600}
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                objectFit: "contain",
              }}
              onError={handleImageError}
              unoptimized={true}
            />

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.5)",
                border: "none",
                color: "#ffffff",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                fontSize: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.5)",
                border: "none",
                color: "#ffffff",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                fontSize: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ›
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div
            style={{
              padding: "20px",
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              justifyContent: "center",
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#f8f9fa",
                  cursor: "pointer",
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                  border:
                    selectedImage === idx
                      ? "2px solid #007bff"
                      : "2px solid transparent",
                }}
                onClick={() => setSelectedImage(idx)}
              >
                <Image
                  src={
                    img.startsWith("http")
                      ? img
                      : `https://cpanel.roomfinder237.com/${img}`
                  }
                  alt={`Property thumbnail ${idx + 1}`}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                  onError={handleImageError}
                  unoptimized={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MediaGallery;
