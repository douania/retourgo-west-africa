
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AuthButtons = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
      {user ? (
        <>
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              Tableau de bord
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            Déconnexion
          </Button>
        </>
      ) : (
        <>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Connexion
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-retourgo-orange hover:bg-retourgo-orange/90" size="sm">
              Inscription
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
