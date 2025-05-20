
import React, { useEffect, useState } from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";
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
  currentFile: File | null;
  onProcessDocument: () => void;
  onFileUpload: (file: File) => void;
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
  currentFile,
  onProcessDocument,
  onFileUpload,
  onDocumentRemove,
  resetCapture
}) => {
  // Local state for preview
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  // Update local preview when a file is uploaded
  useEffect(() => {
    if (currentFile) {
      console.log("Creating object URL for file:", currentFile.name);
      const objectUrl = URL.createObjectURL(currentFile);
      setLocalPreviewUrl(objectUrl);
      
      // Clean up the URL when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [currentFile]);
  
  // Use provided previewUrl or local preview
  const displayPreviewUrl = previewUrl || localPreviewUrl;

  useEffect(() => {
    console.log("displayPreviewUrl:", displayPreviewUrl);
  }, [displayPreviewUrl]);

  if (isProcessing) {
    return <DocumentProcessingIndicator />;
  }

  const hasFile = Boolean(displayPreviewUrl || currentFile);
  
  const handleImageCapture = (file: File) => {
    console.log("Document captured:", file.name);
    onFileUpload(file);
  };

  const handleImageRemove = () => {
    console.log("Document removed");
    if (onDocumentRemove) {
      onDocumentRemove();
    } else {
      resetCapture();
    }
    setLocalPreviewUrl(null);
  };

  const handleProcessDocument = () => {
    console.log("Analyze Document button clicked - handleProcessDocument function");
    if (onProcessDocument) {
      console.log("Calling onProcessDocument");
      onProcessDocument();
    } else {
      console.error("onProcessDocument function is not defined");
    }
  };

  return (
    <>
      <ImageUpload
        onImageCapture={handleImageCapture}
        onImageRemove={handleImageRemove}
        previewUrl={displayPreviewUrl}
        allowCapture={true}
        label={`${title}${sideLabel}`}
        description={description + (showBothSides ? ` (${currentSide === 'front' ? 'Recto' : 'Verso'})` : '')}
      />
      
      {hasFile && (
        <div className="mt-4 space-y-2">
          <Button 
            type="button" 
            className="w-full"
            onClick={handleProcessDocument}
          >
            <ScanSearch className="mr-2 h-4 w-4" />
            Analyser le document
          </Button>
          
          {showBothSides && currentSide === 'back' && (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={resetCapture}
            >
              Recommencer la capture
            </Button>
          )}
        </div>
      )}

      <DocumentTips documentType={documentType} />
    </>
  );
};

export default DocumentScanContent;
