"use client"; // This marks the component as a client component

import dynamic from "next/dynamic";

// Dynamically import SwaggerUI with SSR disabled
const SwaggerUI = dynamic(
  () => import("swagger-ui-react").then((mod) => mod.default),
  {
    ssr: false, // Prevents server-side rendering
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <p>Loading API documentation...</p>
      </div>
    ),
  }
);

// Import CSS only on the client side
import "swagger-ui-react/swagger-ui.css";

// Create a proper component instead of just re-exporting
export function SwaggerDoc({
  url,
  docExpansion,
}: {
  url: string;
  docExpansion: "none" | "list" | "full";
}) {
  return (
    <div className="swagger-wrapper">
      <SwaggerUI
        url={url}
        docExpansion={docExpansion}
        defaultModelExpandDepth={5}
        defaultModelsExpandDepth={5}
      />
    </div>
  );
}
