"use client";

import { useEffect } from "react";
import { animationCreate } from "@/utils/utils";
import ScrollToTop from "@/components/common/ScrollToTop";
import HeaderTwo from "@/layouts/headers/HeaderTwo";
import FooterFour from "@/layouts/footers/FooterFour";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

const Wrapper = ({ children }: any) => {
  useEffect(() => {
    // animation
    const timer = setTimeout(() => {
      animationCreate();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <HeaderTwo style_1={false} style_2={false} />
      {children}
      <FooterFour />
      <ScrollToTop />
    </>
  );
};

export default Wrapper;
