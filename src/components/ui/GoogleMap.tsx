"use client";

import React, { useEffect, useRef } from "react";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  title: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleMap({
  latitude,
  longitude,
  title,
  className = "",
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google Maps"));
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        await loadGoogleMapsScript();

        if (!mapRef.current || !window.google) return;

        const position = { lat: latitude, lng: longitude };

        // Create map
        const map = new window.google.maps.Map(mapRef.current, {
          center: position,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        // Create marker
        const marker = new window.google.maps.Marker({
          position: position,
          map: map,
          title: title,
          animation: window.google.maps.Animation.DROP,
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">${title}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">Property Location</p>
            </div>
          `,
        });

        // Add click listener to marker
        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        // Store references
        mapInstanceRef.current = map;
        markerRef.current = marker;

        // Add click listener to map to close info window
        map.addListener("click", () => {
          infoWindow.close();
        });
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (mapInstanceRef.current) {
        // Google Maps doesn't have a destroy method, but we can clear the div
        if (mapRef.current) {
          mapRef.current.innerHTML = "";
        }
      }
    };
  }, [latitude, longitude, title]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-96 rounded-lg overflow-hidden ${className}`}
      style={{ minHeight: "384px" }}
    />
  );
}
