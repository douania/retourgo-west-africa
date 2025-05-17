
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
  const { isProcessing, processDocument } = useDocumentProcessor({
    documentType,
    onDocumentCaptured
  });

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
            onImageCapture={processDocument}
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
