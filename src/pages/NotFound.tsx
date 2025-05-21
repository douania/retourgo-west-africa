
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-6xl font-bold mb-4 text-retourgo-orange">404</h1>
        <p className="text-xl text-gray-600 mb-8">{t("page.not_found")}</p>
        <div className="flex flex-col gap-4">
          <Link to="/" className="w-full">
            <Button className="w-full">{t("page.return_home")}</Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("registration.go_back")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
