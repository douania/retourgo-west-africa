
import React from "react";
import { FileType } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VerificationStatus } from "@/types/supabase-extensions";

interface DocumentHeaderProps {
  title: string;
  sideLabel?: string;
  verificationStatus?: VerificationStatus;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  title,
  sideLabel = "",
  verificationStatus
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-lg">
        <FileType className="h-5 w-5 text-retourgo-orange" />
        {title}{sideLabel}
      </div>
      
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
           verificationStatus === 'pending' ? 'En attente' : 
           'Non vérifié'}
        </Badge>
      )}
    </div>
  );
};

export default DocumentHeader;
