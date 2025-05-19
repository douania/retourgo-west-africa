
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAIServices } from "@/services/AIService";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DocumentScanner = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { analyzeDocument } = useAIServices();
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if file is an image
      if (!selectedFile.type.startsWith('image/')) {
        setError(t("ai.file_not_image"));
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError("");
    }
  };
  
  const handleScan = async () => {
    if (!file || !documentType || !user?.id) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      
      const base64Result = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64String = reader.result as string;
          // Remove the data:image/... prefix
          const base64 = base64String.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      const response = await analyzeDocument(base64Result, documentType, user.id);
      setResult(response);
    } catch (err: any) {
      setError(err.message || t("ai.document_scan_error"));
    } finally {
      setLoading(false);
    }
  };

  const renderDocumentData = () => {
    if (!result || !result.extractedData) return null;
    
    const data = result.extractedData;
    
    return (
      <div className="mt-4 space-y-2">
        {Object.entries(data).map(([key, value]) => {
          if (typeof value === 'object') return null;
          return (
            <div key={key} className="grid grid-cols-2">
              <span className="font-medium">{key.replace(/_/g, ' ')}:</span>
              <span>{String(value)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("ai.document_scanner")}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="documentType">{t("ai.document_type")}</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder={t("ai.select_document_type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vehicle_registration">{t("ai.vehicle_registration")}</SelectItem>
                <SelectItem value="driver_license">{t("ai.driver_license")}</SelectItem>
                <SelectItem value="id_card">{t("ai.id_card")}</SelectItem>
                <SelectItem value="business_registration">{t("ai.business_registration")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="documentFile">{t("ai.document_file")}</Label>
            <div className="mt-2">
              <input
                id="documentFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label htmlFor="documentFile" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Document preview" className="max-h-60 mb-3 object-contain" />
                  ) : (
                    <FileText className="h-10 w-10 text-gray-400 mb-3" />
                  )}
                  <span className="text-center text-sm">
                    {previewUrl ? t("ai.change_file") : t("ai.upload_document_file")}
                  </span>
                </div>
              </Label>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>{t("ai.error_title")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="mt-6 bg-secondary/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{t("ai.extracted_data")}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{t("ai.confidence_score")}</span>
                  <span className="font-medium">{(result.confidenceScore * 100).toFixed(1)}%</span>
                </div>
                
                {renderDocumentData()}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button 
          onClick={handleScan} 
          disabled={!file || !documentType || loading}
          className="w-full"
        >
          {loading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          {t("ai.scan_document")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentScanner;
