
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CompanyInfoFormData } from "@/components/registration/CompanyInfoForm";
import { VerificationStatus } from "@/types/supabase-extensions";

interface CheckUserProfileResult {
  userType: string | null;
  companyName: string | null;
  verificationStatus: VerificationStatus;
}

export async function checkUserProfile(userId: string): Promise<CheckUserProfileResult> {
  if (!userId) {
    return { userType: null, companyName: null, verificationStatus: null };
  }
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_type, first_name, verification_status')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    if (data) {
      return {
        userType: data.user_type,
        companyName: data.first_name || null,
        verificationStatus: data.verification_status as VerificationStatus
      };
    }
    
    return { userType: null, companyName: null, verificationStatus: null };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { userType: null, companyName: null, verificationStatus: null };
  }
}

export async function updateCompanyProfile(
  userId: string,
  companyInfo: CompanyInfoFormData
): Promise<{ success: boolean; error: Error | null }> {
  if (!userId) {
    return { success: false, error: new Error("User ID is required") };
  }
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: companyInfo.company_name, // Store company name in first_name
        last_name: `NINEA: ${companyInfo.ninea}, RC: ${companyInfo.rc}`, // Store NINEA and RC in last_name
        phone: companyInfo.logistics_contact_phone, // Logistics contact phone
        return_origin: companyInfo.address, // Company address in return_origin
        return_destination: companyInfo.recurrent_locations || null, // Recurring locations in return_destination
        user_type: companyInfo.isTransporter ? "company_transporter" : "company_shipper"
      })
      .eq('id', userId);
      
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating company profile:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error("Unknown error occurred")
    };
  }
}
