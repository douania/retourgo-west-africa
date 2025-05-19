
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DocumentScanner from "@/components/form/DocumentScanner";

export interface CompanyInfoFormData {
  company_name: string;
  ninea: string;
  rc: string;
  address: string;
  logistics_contact_name: string;
  logistics_contact_phone: string;
  transport_license?: string;
  recurrent_locations?: string;
  verification_status?: 'pending' | 'verified' | 'rejected' | null;
}

interface CompanyInfoFormProps {
  companyInfo: CompanyInfoFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step: number;
  isTransporter: boolean;
  businessDocImage?: string | null;
  onDocumentCapture?: (file: File, extractedData?: any) => void;
  onDocumentRemove?: () => void;
}

const CompanyInfoForm = ({
  companyInfo,
  onInputChange,
  step,
  isTransporter,
  businessDocImage,
  onDocumentCapture,
  onDocumentRemove
}: CompanyInfoFormProps) => {
  return (
    <>
      {step === 1 && (
        <div className="space-y-6">
          {onDocumentCapture && onDocumentRemove && (
            <DocumentScanner
              documentType="other"
              title="Document d'immatriculation d'entreprise"
              description="Téléchargez votre NINEA ou Registre de Commerce"
              onDocumentCaptured={onDocumentCapture}
              previewUrl={businessDocImage}
              onDocumentRemove={onDocumentRemove}
              showBothSides={false}
              verificationStatus={companyInfo.verification_status}
            />
          )}
          
          <div className="space-y-2">
            <Label htmlFor="company_name">Raison sociale*</Label>
            <Input
              id="company_name"
              name="company_name"
              value={companyInfo.company_name}
              onChange={onInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ninea">NINEA*</Label>
              <Input
                id="ninea"
                name="ninea"
                value={companyInfo.ninea}
                onChange={onInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rc">Registre de Commerce (RC)*</Label>
              <Input
                id="rc"
                name="rc"
                value={companyInfo.rc}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Adresse du siège*</Label>
            <Input
              id="address"
              name="address"
              value={companyInfo.address}
              onChange={onInputChange}
              required
            />
          </div>
          
          {isTransporter && (
            <div className="space-y-2">
              <Label htmlFor="transport_license">Agrément de transport (si disponible)</Label>
              <Input
                id="transport_license"
                name="transport_license"
                value={companyInfo.transport_license}
                onChange={onInputChange}
              />
            </div>
          )}
          
          {companyInfo.verification_status === 'rejected' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mt-2">
              Votre document d'entreprise a été rejeté. Veuillez télécharger un nouveau document valide pour continuer.
            </div>
          )}
          {companyInfo.verification_status === 'pending' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm mt-2">
              Votre document est en cours de vérification. Certaines fonctionnalités seront limitées jusqu'à la validation.
            </div>
          )}
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="logistics_contact_name">Nom du responsable logistique*</Label>
              <Input
                id="logistics_contact_name"
                name="logistics_contact_name"
                value={companyInfo.logistics_contact_name}
                onChange={onInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logistics_contact_phone">Téléphone du responsable*</Label>
              <Input
                id="logistics_contact_phone"
                name="logistics_contact_phone"
                value={companyInfo.logistics_contact_phone}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          
          {!isTransporter && (
            <div className="space-y-2">
              <Label htmlFor="recurrent_locations">Lieux d'envoi récurrents (optionnel)</Label>
              <Input
                id="recurrent_locations"
                name="recurrent_locations"
                value={companyInfo.recurrent_locations}
                onChange={onInputChange}
                placeholder="Ex: Dakar, Thiès, Saint-Louis"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CompanyInfoForm;
