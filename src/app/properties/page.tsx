"use client";

import dynamic from "next/dynamic";

const PropertiesPage = dynamic(() => import("./PropertiesContent"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default PropertiesPage;
