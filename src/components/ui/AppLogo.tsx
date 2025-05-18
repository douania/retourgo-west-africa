
import React from "react";
import { Link } from "react-router-dom";
import RetourGoLogo from "@/assets/logo";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ 
  size = "md", 
  showText = true, 
  className = "" 
}) => {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };

  const logoSize = sizeMap[size];
  
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <RetourGoLogo className={`${logoSize} mr-2`} />
      {showText && (
        <span className="text-retourgo-orange font-bold text-2xl">
          Retour<span className="text-retourgo-green">Go</span>
        </span>
      )}
    </Link>
  );
};

export default AppLogo;
