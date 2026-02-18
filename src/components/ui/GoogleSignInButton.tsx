"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (
            element: HTMLElement,
            config: Record<string, unknown>
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
  onError?: () => void;
  text?: "signin_with" | "signup_with" | "continue_with";
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  text = "continue_with",
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const initializeGoogle = useCallback(() => {
    if (!window.google || !containerRef.current || !clientId) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential?: string }) => {
        if (response.credential) {
          onSuccess(response.credential);
        } else {
          onError?.();
        }
      },
    });

    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text,
      width: "400",
      logo_alignment: "left",
    });
  }, [clientId, onSuccess, onError, text]);

  useEffect(() => {
    if (!clientId) return;

    if (window.google) {
      initializeGoogle();
      return;
    }

    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => initializeGoogle();
    document.head.appendChild(script);

    return () => {
      scriptLoadedRef.current = false;
    };
  }, [clientId, initializeGoogle]);

  if (!clientId) return null;

  return (
    <div
      ref={containerRef}
      className="flex justify-center [&>div]:w-full"
    />
  );
}
