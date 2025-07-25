import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DocumentScanner from "@/components/form/DocumentScanner";
import { VerificationStatus } from "@/types/supabase-extensions";

export interface PersonalInfoFormData {
  full_name: string;
  id_number: string;
  address: string;
  phone: string;
  email: string;
  preferred_origin?: string;
  verification_status?: VerificationStatus;
}

interface PersonalInfoFormProps {
  personalInfo: PersonalInfoFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step: number;
  isTransporter: boolean;
  idCardImage?: string | null;
  onIdCardCapture?: (file: File, extractedData?: any) => void;
  onIdCardRemove?: () => void;
}

const PersonalInfoForm = ({
  personalInfo,
  onInputChange,
  step,
  isTransporter,
  idCardImage,
  onIdCardCapture,
  onIdCardRemove
}: PersonalInfoFormProps) => {
  return (
    <>
      {step === 1 && (
        <div className="space-y-6">
          {onIdCardCapture && onIdCardRemove && (
            <DocumentScanner
              documentType="id_card"
              onDocumentCaptured={onIdCardCapture}
              previewUrl={idCardImage}
              onDocumentRemove={onIdCardRemove}
              verificationStatus={personalInfo.verification_status}
            />
          )}
          
          <div className="space-y-2">
            <Label htmlFor="full_name">Nom complet*</Label>
            <Input
              id="full_name"
              name="full_name"
              value={personalInfo.full_name}
              onChange={onInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="id_number">Numéro de pièce d'identité*</Label>
            <Input
              id="id_number"
              name="id_number"
              value={personalInfo.id_number}
              onChange={onInputChange}
              required
            />
          </div>
          
          {personalInfo.verification_status === 'rejected' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mt-2">
              Votre document a été rejeté. Veuillez télécharger un nouveau document valide pour continuer.
            </div>
          )}
          {personalInfo.verification_status === 'pending' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm mt-2">
              Votre document est en cours de vérification. Certaines fonctionnalités seront limitées jusqu'à la validation.
            </div>
          )}
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              value={personalInfo.address || ""}
              onChange={onInputChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone*</Label>
              <Input
                id="phone"
                name="phone"
                value={personalInfo.phone}
                onChange={onInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={personalInfo.email}
                onChange={onInputChange}
                disabled
              />
            </div>
          </div>
          
          {!isTransporter && (
            <div className="space-y-2">
              <Label htmlFor="preferred_origin">Adresse de départ habituelle (optionnelle)</Label>
              <Input
                id="preferred_origin"
                name="preferred_origin"
                value={personalInfo.preferred_origin || ""}
                onChange={onInputChange}
                placeholder="Ex: Dakar, Quartier Mermoz"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PersonalInfoForm;
