
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { FileType } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DocumentTips from "./DocumentTips";
import DocumentProcessingIndicator from "./DocumentProcessingIndicator";
import { 
  DocumentType, 
  extractDocumentData, 
  getDocumentTitle, 
  getDocumentDescription 
} from "@/utils/document-utils";

interface DocumentScannerProps {
  onDocumentCaptured: (file: File, extractedData?: any) => void;
  documentType: DocumentType;
  title?: string;
  description?: string;
  previewUrl?: string | null;
  onDocumentRemove?: () => void;
}

const DocumentScanner = ({
  onDocumentCaptured,
  documentType,
  title,
  description,
  previewUrl,
  onDocumentRemove
}: DocumentScannerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleImageCapture = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Extract document data using our utility function
      const extractedData = await extractDocumentData(file, documentType);
      
      // Pass the file and extracted data to the parent component
      onDocumentCaptured(file, extractedData);
      
      // Show success toast
      toast({
        title: "Document traité",
        description: extractedData ? "Les informations ont été extraites avec succès." : "Le document a été enregistré.",
      });
      
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Erreur de traitement",
        description: "Une erreur est survenue lors du traitement du document.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const documentTitle = getDocumentTitle(documentType, title);
  const documentDesc = getDocumentDescription(documentType, description);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileType className="h-5 w-5 text-retourgo-orange" />
          {documentTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <DocumentProcessingIndicator />
        ) : (
          <ImageUpload
            onImageCapture={handleImageCapture}
            onImageRemove={onDocumentRemove}
            previewUrl={previewUrl}
            allowCapture={true}
            label={documentTitle}
            description={documentDesc}
          />
        )}

        <DocumentTips documentType={documentType} />
      </CardContent>
    </Card>
  );
};

export default DocumentScanner;
