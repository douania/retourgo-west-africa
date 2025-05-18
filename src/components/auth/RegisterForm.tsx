
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import UserTypeSelect from "./UserTypeSelect";
import SocialSignUp from "./SocialSignUp";
import TermsCheckbox from "./TermsCheckbox";

interface RegisterFormProps {
  preselectedUserType?: string;
}

const RegisterForm = ({ preselectedUserType }: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState(preselectedUserType || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { signUp, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Update userType when preselectedUserType changes
  useState(() => {
    if (preselectedUserType) {
      setUserType(preselectedUserType);
    }
  }, [preselectedUserType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await signUp(email, password, {
        firstName,
        lastName,
        phone,
        userType,
      });
      
      // Navigate to login page after successful registration
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="first-name">Prénom</Label>
          <div className="mt-1">
            <Input
              id="first-name"
              name="first-name"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="last-name">Nom</Label>
          <div className="mt-1">
            <Input
              id="last-name"
              name="last-name"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="email">Adresse email</Label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <div className="mt-1">
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Only show user type select if no preselected type */}
      {!preselectedUserType && (
        <UserTypeSelect value={userType} onChange={setUserType} />
      )}

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <div className="mt-1">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
        <div className="mt-1">
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <TermsCheckbox value={acceptedTerms} onChange={setAcceptedTerms} />

      <div>
        <Button
          type="submit"
          className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90"
          disabled={isLoading || !userType || !acceptedTerms}
        >
          {isLoading ? "Création en cours..." : "Créer un compte"}
        </Button>
      </div>

      <SocialSignUp />
    </form>
  );
};

export default RegisterForm;
