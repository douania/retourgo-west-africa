
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <div className="bg-retourgo-orange py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Prêt à optimiser vos trajets?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-orange-100">
            Rejoignez RetourGo dès aujourd'hui et transformez vos trajets retour en opportunités de revenus.
            Notre plateforme est gratuite pendant 3 mois!
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/register">
              <Button className="bg-white text-retourgo-orange hover:bg-orange-50">
                Créer un compte
              </Button>
            </Link>
            <Link to="/how-it-works" className="text-white font-semibold">
              En savoir plus <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;
