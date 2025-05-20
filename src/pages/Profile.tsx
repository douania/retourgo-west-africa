
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Truck } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  user_type: string;
  avatar_url: string | null;
  rating: number | null;
  rating_count: number | null;
}

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfileData(data);
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setPhone(data.phone || "");
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: t("profile.error"),
          description: t("profile.load_error"),
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [user, navigate, toast, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) {
        throw error;
      }

      toast({
        title: t("profile.updated"),
        description: t("profile.update_success"),
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: t("profile.error"),
        description: t("profile.update_error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToVehicleRegistration = () => {
    navigate("/vehicle-selection");
  };

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>{t("profile.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("profile.your_profile")}</h1>
          <p className="mt-2 text-lg text-gray-600">
            {t("profile.update_info")}
          </p>
        </div>

        <Card className="p-6 bg-white shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">{t("profile.first_name")}</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lastName">{t("profile.last_name")}</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="mt-1 bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                {t("profile.email_note")}
              </p>
            </div>

            <div>
              <Label htmlFor="phone">{t("profile.phone")}</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="userType">{t("profile.user_type")}</Label>
              <Input
                id="userType"
                value={
                  profileData.user_type === "transporter"
                    ? t("profile.transporter")
                    : profileData.user_type === "shipper"
                    ? t("profile.shipper")
                    : t("profile.individual")
                }
                disabled
                className="mt-1 bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                {t("profile.user_type_note")}
              </p>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                className="bg-retourgo-orange hover:bg-retourgo-orange/90"
                disabled={isLoading}
              >
                {isLoading ? t("profile.saving") : t("profile.save_changes")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                {t("profile.back_dashboard")}
              </Button>
            </div>
          </form>
        </Card>

        {profileData.user_type === "transporter" && (
          <Card className="p-6 bg-white shadow-md mt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-retourgo-orange" />
                <h2 className="text-xl font-semibold text-gray-900">{t("profile.vehicle_management")}</h2>
              </div>
              <p className="text-gray-600">
                {t("profile.transporter_message")}
              </p>
              <Button 
                onClick={navigateToVehicleRegistration}
                className="bg-retourgo-orange hover:bg-retourgo-orange/90 w-full sm:w-auto"
              >
                <Truck className="mr-2 h-5 w-5" /> {t("profile.add_vehicle")}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
