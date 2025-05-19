
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { FileType } from "lucide-react";
import DocumentTips from "./DocumentTips";
import DocumentProcessingIndicator from "./DocumentProcessingIndicator";
import { 
  DocumentType, 
  getDocumentTitle, 
  getDocumentDescription 
} from "@/utils/document-utils";
import { useDocumentProcessor } from "@/hooks/useDocumentProcessor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocumentScannerProps {
  onDocumentCaptured: (file: File, extractedData?: any) => void;
  documentType: DocumentType;
  title?: string;
  description?: string;
  previewUrl?: string | null;
  onDocumentRemove?: () => void;
  showBothSides?: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected' | null;
}

const DocumentScanner = ({
  onDocumentCaptured,
  documentType,
  title,
  description,
  previewUrl,
  onDocumentRemove,
  showBothSides = true,
  verificationStatus
}: DocumentScannerProps) => {
  const { isProcessing, processDocument, currentSide, resetCapture } = useDocumentProcessor({
    documentType,
    onDocumentCaptured,
    showBothSides
  });

  const documentTitle = getDocumentTitle(documentType, title);
  const documentDesc = getDocumentDescription(documentType, description);
  
  // Texte pour montrer le côté actuel du document
  const getSideLabel = () => {
    if (!showBothSides) return "";
    
    return currentSide === 'front' 
      ? " - Recto" 
      : " - Verso";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileType className="h-5 w-5 text-retourgo-orange" />
            {documentTitle}{getSideLabel()}
          </CardTitle>
          
          {verificationStatus && (
            <Badge 
              variant={
                verificationStatus === 'verified' ? 'success' : 
                verificationStatus === 'rejected' ? 'destructive' : 
                'outline'
              }
            >
              {verificationStatus === 'verified' ? 'Vérifié' : 
               verificationStatus === 'rejected' ? 'Rejeté' : 
               'En attente'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <DocumentProcessingIndicator />
        ) : (
          <>
            <ImageUpload
              onImageCapture={processDocument}
              onImageRemove={onDocumentRemove || resetCapture}
              previewUrl={previewUrl}
              allowCapture={true}
              label={`${documentTitle}${getSideLabel()}`}
              description={documentDesc + (showBothSides ? ` (${currentSide === 'front' ? 'Recto' : 'Verso'})` : '')}
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
          </>
        )}

        <DocumentTips documentType={documentType} />
      </CardContent>
    </Card>
  );
};

export default DocumentScanner;
