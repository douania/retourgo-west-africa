
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DocumentScanner from "@/components/form/DocumentScanner";

export interface PersonalInfoFormData {
  full_name: string;
  id_number: string;
  address?: string;
  phone: string;
  email: string;
  preferred_origin?: string;
}

interface PersonalInfoFormProps {
  personalInfo: PersonalInfoFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  idCardImage: string | null;
  onIdCardCapture: (file: File, extractedData?: any) => void;
  onIdCardRemove: () => void;
  step: number;
  isTransporter: boolean;
}

const PersonalInfoForm = ({
  personalInfo,
  onInputChange,
  idCardImage,
  onIdCardCapture,
  onIdCardRemove,
  step,
  isTransporter
}: PersonalInfoFormProps) => {
  return (
    <>
      {step === 1 && (
        <div className="space-y-6">
          <DocumentScanner
            documentType="id_card"
            onDocumentCaptured={onIdCardCapture}
            previewUrl={idCardImage}
            onDocumentRemove={onIdCardRemove}
            showBothSides={true}
          />
          
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
