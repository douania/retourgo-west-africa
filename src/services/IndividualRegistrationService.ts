
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoFormData } from "@/components/registration/PersonalInfoForm";
import { VerificationStatus } from "@/types/supabase-extensions";

interface CheckUserProfileResult {
  userType: string | null;
  fullName: string | null;
  verificationStatus: VerificationStatus;
  phone: string | null;
  email: string | null;
}

export async function checkUserProfile(userId: string): Promise<CheckUserProfileResult> {
  if (!userId) {
    return { 
      userType: null, 
      fullName: null, 
      verificationStatus: null,
      phone: null,
      email: null
    };
  }
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_type, first_name, last_name, phone, verification_status')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    if (data) {
      const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();
      
      return {
        userType: data.user_type,
        fullName: fullName || null,
        verificationStatus: data.verification_status as VerificationStatus,
        phone: data.phone || null,
        email: null // Email is stored in auth.users, not profiles
      };
    }
    
    return { 
      userType: null, 
      fullName: null, 
      verificationStatus: null,
      phone: null,
      email: null
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { 
      userType: null, 
      fullName: null, 
      verificationStatus: null,
      phone: null,
      email: null
    };
  }
}

export async function updateIndividualProfile(
  userId: string,
  personalInfo: PersonalInfoFormData,
  isTransporter: boolean
): Promise<{ success: boolean; error: Error | null }> {
  if (!userId) {
    return { success: false, error: new Error("User ID is required") };
  }
  
  try {
    // Split full name into first and last name
    const nameParts = personalInfo.full_name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");
    
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: personalInfo.phone,
        return_origin: personalInfo.preferred_origin || null,
        user_type: isTransporter ? "individual_transporter" : "individual_shipper"
      })
      .eq('id', userId);
      
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating personal info:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error("Unknown error occurred")
    };
  }
}
