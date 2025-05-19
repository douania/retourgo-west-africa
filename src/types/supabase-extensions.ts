
import { Database } from "@/integrations/supabase/types";

// Extend the Database types to include our new tables and columns
export type ExtendedDatabase = Database & {
  public: {
    Tables: {
      user_documents: {
        Row: {
          id: string;
          user_id: string;
          document_type: string;
          document_url: string;
          uploaded_at: string;
          verification_status: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_type: string;
          document_url: string;
          uploaded_at?: string;
          verification_status?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          document_type?: string;
          document_url?: string;
          uploaded_at?: string;
          verification_status?: string | null;
        };
      };
      profiles: {
        Row: {
          verification_status: string | null;
        } & Database["public"]["Tables"]["profiles"]["Row"];
        Insert: {
          verification_status?: string | null;
        } & Database["public"]["Tables"]["profiles"]["Insert"];
        Update: {
          verification_status?: string | null;
        } & Database["public"]["Tables"]["profiles"]["Update"];
      };
    } & Database["public"]["Tables"];
  }
};

// Create a typed supabase client with our extended types
export type UserDocumentsRow = ExtendedDatabase["public"]["Tables"]["user_documents"]["Row"];
export type UserDocumentsInsert = ExtendedDatabase["public"]["Tables"]["user_documents"]["Insert"];
export type UserDocumentsUpdate = ExtendedDatabase["public"]["Tables"]["user_documents"]["Update"];

// Helper function to create a typed supabase client
export const createTypedSupabaseClient = (supabaseClient: any) => {
  return supabaseClient as unknown as ReturnType<typeof supabaseClient> & {
    from<T extends keyof ExtendedDatabase["public"]["Tables"]>(
      table: T
    ): ReturnType<typeof supabaseClient.from>;
  };
};

// Define verification status type to ensure consistency
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'unverified' | null;
