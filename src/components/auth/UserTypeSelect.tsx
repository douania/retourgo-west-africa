
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserTypeSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

const UserTypeSelect = ({ value, onChange }: UserTypeSelectProps) => {
  return (
    <div>
      <Label htmlFor="user-type">Type d'utilisateur</Label>
      <div className="mt-1">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez votre profil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transporter">Transporteur</SelectItem>
            <SelectItem value="shipper">Expéditeur</SelectItem>
            <SelectItem value="individual">Particulier</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserTypeSelect;
