
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Truck, Package } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
          <svg
            className="absolute inset-y-0 right-0 hidden h-full w-48 translate-x-1/2 transform text-white lg:block"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Ne voyagez plus</span>
                <span className="block text-retourgo-orange xl:inline"> à vide</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                RetourGo connecte les transporteurs avec du fret disponible en Afrique de l'Ouest. 
                Optimisez vos trajets retour, augmentez vos revenus et réduisez l'empreinte carbone.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/register">
                    <Button className="w-full flex items-center justify-center px-8 py-6 bg-retourgo-orange hover:bg-retourgo-orange/90 text-base font-medium text-white md:py-6 md:px-10 md:text-lg">
                      Commencer
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/how-it-works">
                    <Button variant="outline" className="w-full flex items-center justify-center px-8 py-6 text-base font-medium text-retourgo-orange md:py-6 md:px-10 md:text-lg">
                      Comment ça marche
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 sm:justify-center lg:justify-start">
                <Link to="/vehicles" className="inline-flex items-center text-retourgo-orange font-medium">
                  <Truck className="h-5 w-5 mr-1" />
                  Enregistrer un véhicule
                </Link>
                <Link to="/new-freight" className="inline-flex items-center text-retourgo-orange font-medium">
                  <Package className="h-5 w-5 mr-1" />
                  Publier un fret
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
          src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1175&q=80"
          alt="Camion de transport en Afrique de l'Ouest"
        />
      </div>
    </div>
  );
};

export default HeroSection;
