
import React from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import DocumentProcessingIndicator from "./DocumentProcessingIndicator";
import DocumentTips from "./DocumentTips";
import { DocumentType } from "@/utils/document-utils";

interface DocumentScanContentProps {
  isProcessing: boolean;
  documentType: DocumentType;
  title: string;
  description: string;
  previewUrl?: string | null;
  sideLabel: string;
  showBothSides: boolean;
  currentSide: 'front' | 'back';
  onProcessDocument: (file: File) => void;
  onDocumentRemove?: () => void;
  resetCapture: () => void;
}

const DocumentScanContent: React.FC<DocumentScanContentProps> = ({
  isProcessing,
  documentType,
  title,
  description,
  previewUrl,
  sideLabel,
  showBothSides,
  currentSide,
  onProcessDocument,
  onDocumentRemove,
  resetCapture
}) => {
  if (isProcessing) {
    return <DocumentProcessingIndicator />;
  }

  return (
    <>
      <ImageUpload
        onImageCapture={onProcessDocument}
        onImageRemove={onDocumentRemove || resetCapture}
        previewUrl={previewUrl}
        allowCapture={true}
        label={`${title}${sideLabel}`}
        description={description + (showBothSides ? ` (${currentSide === 'front' ? 'Recto' : 'Verso'})` : '')}
      />
      
      {showBothSides && currentSide === 'back' && (
        <Button 
          type="button" 
          variant="outline" 
          className="mt-2 w-full"
          onClick={resetCapture}
        >
          Recommencer la capture
        </Button>
      )}

      <DocumentTips documentType={documentType} />
    </>
  );
};

export default DocumentScanContent;
