
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  DocumentType, 
  getDocumentTitle, 
  getDocumentDescription 
} from "@/utils/document-utils";
import { useDocumentProcessor } from "@/hooks/useDocumentProcessor";
import { VerificationStatus } from "@/types/supabase-extensions";
import DocumentHeader from "./DocumentHeader";
import DocumentScanContent from "./DocumentScanContent";

interface DocumentScannerProps {
  onDocumentCaptured: (file: File, extractedData?: any) => void;
  documentType: DocumentType;
  title?: string;
  description?: string;
  previewUrl?: string | null;
  onDocumentRemove?: () => void;
  showBothSides?: boolean;
  verificationStatus?: VerificationStatus;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onDocumentCaptured,
  documentType,
  title,
  description,
  previewUrl,
  onDocumentRemove,
  showBothSides = true,
  verificationStatus
}) => {
  const { isProcessing, processDocument, currentSide, resetCapture } = useDocumentProcessor({
    documentType,
    onDocumentCaptured,
    showBothSides
  });

  const documentTitle = getDocumentTitle(documentType, title);
  const documentDesc = getDocumentDescription(documentType, description);
  
  // Get side label based on current side
  const getSideLabel = () => {
    if (!showBothSides) return "";
    return currentSide === 'front' ? " - Recto" : " - Verso";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <DocumentHeader 
          title={documentTitle}
          sideLabel={getSideLabel()}
          verificationStatus={verificationStatus}
        />
      </CardHeader>
      <CardContent>
        <DocumentScanContent 
          isProcessing={isProcessing}
          documentType={documentType}
          title={documentTitle}
          description={documentDesc}
          previewUrl={previewUrl}
          sideLabel={getSideLabel()}
          showBothSides={showBothSides}
          currentSide={currentSide}
          onProcessDocument={processDocument}
          onDocumentRemove={onDocumentRemove}
          resetCapture={resetCapture}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentScanner;
