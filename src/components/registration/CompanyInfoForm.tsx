
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface CompanyInfoFormData {
  company_name: string;
  ninea: string;
  rc: string;
  address: string;
  logistics_contact_name: string;
  logistics_contact_phone: string;
  transport_license?: string;
  recurrent_locations?: string;
}

interface CompanyInfoFormProps {
  companyInfo: CompanyInfoFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step: number;
  isTransporter: boolean;
}

const CompanyInfoForm = ({
  companyInfo,
  onInputChange,
  step,
  isTransporter
}: CompanyInfoFormProps) => {
  return (
    <>
      {step === 1 && (
        <div className="space-y-6">
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
