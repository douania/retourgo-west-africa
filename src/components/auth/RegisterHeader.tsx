
import { Link } from "react-router-dom";

const RegisterHeader = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <Link to="/" className="flex justify-center">
        <span className="text-retourgo-orange font-bold text-3xl">
          Retour<span className="text-retourgo-green">Go</span>
        </span>
      </Link>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Créer un compte
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Ou{" "}
        <Link
          to="/login"
          className="font-medium text-retourgo-orange hover:text-retourgo-orange/80"
        >
          connectez-vous à votre compte existant
        </Link>
      </p>
    </div>
  );
};

export default RegisterHeader;
