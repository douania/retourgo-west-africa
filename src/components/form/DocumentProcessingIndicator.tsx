
import React from "react";

const DocumentProcessingIndicator = () => {
  return (
    <div className="h-64 flex flex-col items-center justify-center space-y-4 border rounded-lg bg-gray-50">
      <div className="w-12 h-12 border-4 border-t-retourgo-orange rounded-full animate-spin"></div>
      <p className="text-sm text-gray-600">Analyse du document en cours...</p>
    </div>
  );
};

export default DocumentProcessingIndicator;
