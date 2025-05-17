
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FreightDetailsHeaderProps {
  onBack: () => void;
  title: string | null;
}

export const FreightDetailsHeader = ({ onBack, title }: FreightDetailsHeaderProps) => {
  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Button>

      {title && (
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
      )}
    </>
  );
};
