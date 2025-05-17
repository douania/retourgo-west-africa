
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Pricing = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Tarification simple et transparente
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Des forfaits adaptés aux besoins des transporteurs et des expéditeurs 
                en Afrique de l'Ouest, avec une période d'essai gratuite de 3 mois.
              </p>
            </div>

            <div className="mt-16 flex justify-center">
              <Tabs defaultValue="monthly" className="w-full max-w-3xl">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="monthly">Mensuel</TabsTrigger>
                  <TabsTrigger value="yearly">Annuel (15% de réduction)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="monthly" className="mt-8">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Basic Plan */}
                    <Card className="flex flex-col p-8 shadow-lg">
                      <h3 className="text-lg font-semibold text-gray-900">Transporteur</h3>
                      <p className="mt-4 text-sm text-gray-500">
                        Idéal pour les petits et moyens transporteurs cherchant à optimiser leurs trajets retour.
                      </p>
                      <div className="mt-6">
                        <p className="text-5xl font-extrabold text-gray-900">15%</p>
                        <p className="text-base text-gray-500">de commission par trajet</p>
                      </div>
                      <ul className="mt-8 space-y-4 text-sm text-gray-600">
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Notifications en temps réel</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Système de géolocalisation</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Système de notes et avis</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Filtres avancés de recherche</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Réduction à 12% pour note ≥ 4.5</span>
                        </li>
                        <li className="flex items-center text-gray-400">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                          <span className="ml-3">Badge Transporteur Premium</span>
                        </li>
                      </ul>
                      <div className="mt-8 flex flex-col">
                        <Link to="/register">
                          <Button className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90">
                            Commencer gratuitement
                          </Button>
                        </Link>
                        <p className="mt-2 text-xs text-center text-gray-500">3 mois gratuits</p>
                      </div>
                    </Card>

                    {/* Premium Plan */}
                    <Card className="flex flex-col p-8 shadow-lg border-2 border-retourgo-orange relative">
                      <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-retourgo-orange px-3 py-1 text-xs font-medium text-white text-center">
                        Populaire
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Expéditeur</h3>
                      <p className="mt-4 text-sm text-gray-500">
                        Pour les entreprises qui expédient régulièrement des marchandises à travers l'Afrique de l'Ouest.
                      </p>
                      <div className="mt-6">
                        <p className="text-5xl font-extrabold text-gray-900">10%</p>
                        <p className="text-base text-gray-500">de commission par expédition</p>
                      </div>
                      <ul className="mt-8 space-y-4 text-sm text-gray-600">
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Publication illimitée de fret</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Accès aux meilleurs transporteurs</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Système de notes et avis</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Suivi en temps réel des livraisons</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Paiements sécurisés</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Badge Expéditeur Premium</span>
                        </li>
                      </ul>
                      <div className="mt-8 flex flex-col">
                        <Link to="/register">
                          <Button className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90">
                            Commencer gratuitement
                          </Button>
                        </Link>
                        <p className="mt-2 text-xs text-center text-gray-500">3 mois gratuits</p>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="yearly" className="mt-8">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Basic Plan Yearly */}
                    <Card className="flex flex-col p-8 shadow-lg">
                      <h3 className="text-lg font-semibold text-gray-900">Transporteur</h3>
                      <p className="mt-4 text-sm text-gray-500">
                        Idéal pour les petits et moyens transporteurs cherchant à optimiser leurs trajets retour.
                      </p>
                      <div className="mt-6">
                        <p className="text-5xl font-extrabold text-gray-900">12.75%</p>
                        <p className="text-base text-gray-500">de commission par trajet</p>
                      </div>
                      <ul className="mt-8 space-y-4 text-sm text-gray-600">
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Notifications en temps réel</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Système de géolocalisation</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Système de notes et avis</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Filtres avancés de recherche</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Réduction à 10.2% pour note ≥ 4.5</span>
                        </li>
                        <li className="flex items-center text-gray-400">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                          <span className="ml-3">Badge Transporteur Premium</span>
                        </li>
                      </ul>
                      <div className="mt-8 flex flex-col">
                        <Link to="/register">
                          <Button className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90">
                            Commencer gratuitement
                          </Button>
                        </Link>
                        <p className="mt-2 text-xs text-center text-gray-500">3 mois gratuits + 15% de réduction</p>
                      </div>
                    </Card>

                    {/* Premium Plan Yearly */}
                    <Card className="flex flex-col p-8 shadow-lg border-2 border-retourgo-orange relative">
                      <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-retourgo-orange px-3 py-1 text-xs font-medium text-white text-center">
                        Populaire
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Expéditeur</h3>
                      <p className="mt-4 text-sm text-gray-500">
                        Pour les entreprises qui expédient régulièrement des marchandises à travers l'Afrique de l'Ouest.
                      </p>
                      <div className="mt-6">
                        <p className="text-5xl font-extrabold text-gray-900">8.5%</p>
                        <p className="text-base text-gray-500">de commission par expédition</p>
                      </div>
                      <ul className="mt-8 space-y-4 text-sm text-gray-600">
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Publication illimitée de fret</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Accès aux meilleurs transporteurs</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Système de notes et avis</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Suivi en temps réel des livraisons</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Paiements sécurisés</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">Badge Expéditeur Premium</span>
                        </li>
                      </ul>
                      <div className="mt-8 flex flex-col">
                        <Link to="/register">
                          <Button className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90">
                            Commencer gratuitement
                          </Button>
                        </Link>
                        <p className="mt-2 text-xs text-center text-gray-500">3 mois gratuits + 15% de réduction</p>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                Questions fréquentes
              </h2>
              <div className="mx-auto max-w-3xl divide-y divide-gray-200">
                <div className="py-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Comment fonctionne la période d'essai gratuite?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Tous les nouveaux utilisateurs bénéficient de 3 mois d'utilisation gratuite
                    de la plateforme. Après cette période, les commissions standard s'appliquent.
                  </p>
                </div>
                <div className="py-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Comment sont calculées les commissions?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Les commissions sont calculées en pourcentage du montant total de chaque transaction
                    effectuée via la plateforme. Elles sont déduites automatiquement lors du paiement.
                  </p>
                </div>
                <div className="py-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Comment obtenir une réduction sur les commissions?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Les transporteurs avec une note moyenne supérieure ou égale à 4.5/5 bénéficient
                    automatiquement d'une réduction sur les commissions (de 15% à 12%).
                  </p>
                </div>
                <div className="py-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Puis-je changer de forfait?
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Oui, vous pouvez passer du forfait mensuel au forfait annuel à tout moment
                    pour bénéficier de la réduction de 15%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
