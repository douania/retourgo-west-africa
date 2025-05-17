
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

type TermsCheckboxProps = {
  value: boolean;
  onChange: (checked: boolean) => void;
};

const TermsCheckbox = ({ value, onChange }: TermsCheckboxProps) => {
  return (
    <div className="flex items-center">
      <Checkbox
        id="terms"
        checked={value}
        onCheckedChange={onChange}
        className="h-4 w-4 text-retourgo-orange focus:ring-retourgo-orange border-gray-300 rounded"
      />
      <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
        J'accepte les{" "}
        <Link
          to="/terms"
          className="font-medium text-retourgo-orange hover:text-retourgo-orange/80"
        >
          conditions d'utilisation
        </Link>{" "}
        et la{" "}
        <Link
          to="/privacy"
          className="font-medium text-retourgo-orange hover:text-retourgo-orange/80"
        >
          politique de confidentialité
        </Link>
      </label>
    </div>
  );
};

export default TermsCheckbox;
