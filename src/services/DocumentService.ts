
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { createTypedSupabaseClient, VerificationStatus, UserDocumentsRow } from "@/types/supabase-extensions";

// Create a typed client for the extended database
const typedSupabase = createTypedSupabaseClient(supabase);

export interface DocumentUploadResult {
  filePath: string | null;
  error: Error | null;
}

export async function uploadDocument(
  userId: string, 
  file: File, 
  documentType: string
): Promise<DocumentUploadResult> {
  if (!file) return { filePath: null, error: new Error("No file provided") };
  
  try {
    // Create a unique filename with the extension
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${documentType}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('user_documents')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Store document reference in the user_documents table
    const { error: docError } = await typedSupabase
      .from('user_documents')
      .upsert({
        user_id: userId,
        document_type: documentType,
        document_url: filePath,
        uploaded_at: new Date().toISOString(),
        verification_status: 'pending'
      }, {
        onConflict: 'user_id, document_type'
      });
      
    if (docError) throw docError;
    
    // Update the verification status of the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ verification_status: 'pending' })
      .eq('id', userId);
      
    if (profileError) throw profileError;
    
    return { filePath, error: null };
  } catch (error) {
    console.error("Error uploading document:", error);
    return { filePath: null, error: error instanceof Error ? error : new Error("Unknown error occurred") };
  }
}

export async function fetchDocumentImage(
  userId: string, 
  documentType: string
): Promise<string | null> {
  try {
    // Using typedSupabase to access the user_documents table
    const { data: documentData, error: documentError } = await typedSupabase
      .from('user_documents')
      .select('document_url')
      .eq('user_id', userId)
      .eq('document_type', documentType)
      .maybeSingle();
      
    if (documentError) {
      console.error("Error fetching document:", documentError);
      return null;
    }
    
    if (!documentData?.document_url) return null;
    
    // Get a signed URL to display the image
    const { data: storageData } = await supabase.storage
      .from('user_documents')
      .createSignedUrl(documentData.document_url, 3600);
      
    return storageData?.signedUrl || null;
  } catch (error) {
    console.error(`Error fetching ${documentType} image:`, error);
    return null;
  }
}

export function useDocumentUploader() {
  const { toast } = useToast();
  
  const uploadWithToast = async (
    userId: string, 
    file: File, 
    documentType: string
  ): Promise<string | null> => {
    const { filePath, error } = await uploadDocument(userId, file, documentType);
    
    if (error) {
      toast({
        title: "Erreur d'upload",
        description: "Une erreur est survenue lors de l'envoi de votre document.",
        variant: "destructive"
      });
      return null;
    }
    
    return filePath;
  };
  
  return { uploadDocument: uploadWithToast };
}
