
import { Card } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Créez votre profil",
    description:
      "Inscrivez-vous en quelques minutes comme transporteur ou expéditeur. Vérifiez votre identité et commencez à utiliser RetourGo.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Publiez ou recherchez du fret",
    description:
      "Les expéditeurs publient leurs marchandises. Les transporteurs activent leur géolocalisation et reçoivent des alertes de fret à proximité.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Négociez et confirmez",
    description:
      "Discutez des détails, convenez d'un prix et confirmez le transport dans l'application pour sécuriser la transaction.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
        />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Transportez et livrez",
    description:
      "Suivez le statut de livraison en temps réel. L'expéditeur confirme la réception pour libérer le paiement.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Évaluez le service",
    description:
      "Notez votre expérience pour aider la communauté. Les bonnes notes améliorent votre visibilité et réduisent vos commissions.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    ),
  },
];

const HowItWorksSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-base font-semibold leading-7 text-retourgo-orange">
            Processus simple
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Comment RetourGo fonctionne-t-il ?
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Notre plateforme est conçue pour être intuitive et efficace, permettant 
            aux transporteurs et expéditeurs de se connecter facilement.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 relative hover:shadow-lg transition-shadow">
              <div className="mb-6 flex items-center justify-center h-12 w-12 rounded-full bg-retourgo-orange text-white">
                {step.icon}
              </div>
              <p className="font-bold text-5xl text-gray-200 absolute top-2 right-4">
                {step.number}
              </p>
              <h3 className="text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden xl:block absolute top-12 left-full w-8 h-1 bg-gray-200 -ml-4"></div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
