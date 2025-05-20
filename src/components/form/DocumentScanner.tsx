
import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";

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
  const { user } = useAuth();
  const [retryCount, setRetryCount] = useState(0);

  // Log the authentication status
  useEffect(() => {
    console.log("DocumentScanner - Auth state:", user ? "Authenticated" : "Not authenticated");
    if (user) {
      console.log("User ID:", user.id);
    }
  }, [user]);
  
  const { 
    isProcessing, 
    processingError,
    processDocument, 
    handleFileUpload, 
    currentSide, 
    currentFile,
    processingAttempts,
    resetCapture 
  } = useDocumentProcessor({
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

  // Handle document processing with better debugging
  const handleProcessDocument = async () => {
    console.log("DocumentScanner - handleProcessDocument called");
    setRetryCount(prev => prev + 1);
    try {
      await processDocument();
    } catch (error) {
      console.error("Error in DocumentScanner processDocument:", error);
    }
  };

  // Handle retry when there's an error
  const handleRetry = () => {
    console.log("Retrying document processing");
    setRetryCount(0);
    resetCapture();
  };

  // Get enhanced error message based on attempts
  const getEnhancedErrorMessage = () => {
    if (!processingError) return "";
    
    let message = processingError;
    
    if (processingAttempts >= 2) {
      message += "\n\nAstuces pour améliorer la reconnaissance:";
      message += "\n• Assurez-vous que l'image est bien éclairée";
      message += "\n• Évitez les reflets et les ombres";
      message += "\n• Placez le document sur un fond contrasté";
      message += "\n• Positionnez le document bien à plat et cadré";
    }
    
    return message;
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
        {processingError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span>{processingError}</span>
                <button 
                  onClick={handleRetry}
                  className="flex items-center text-xs text-primary hover:underline"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Réessayer
                </button>
              </div>
              
              {processingAttempts >= 2 && (
                <div className="text-xs mt-2 space-y-1">
                  <p className="font-semibold">Astuces pour améliorer la reconnaissance:</p>
                  <ul className="list-disc list-inside">
                    <li>Assurez-vous que l'image est bien éclairée</li>
                    <li>Évitez les reflets et les ombres</li>
                    <li>Placez le document sur un fond contrasté</li>
                    <li>Positionnez le document bien à plat et cadré</li>
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <DocumentScanContent 
          isProcessing={isProcessing}
          documentType={documentType}
          title={documentTitle}
          description={documentDesc}
          previewUrl={previewUrl}
          sideLabel={getSideLabel()}
          showBothSides={showBothSides}
          currentSide={currentSide}
          currentFile={currentFile}
          onProcessDocument={handleProcessDocument}
          onFileUpload={handleFileUpload}
          onDocumentRemove={onDocumentRemove}
          resetCapture={resetCapture}
          retryCount={retryCount}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentScanner;
