
import { useState } from 'react';
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    quote: "Grâce à RetourGo, je ne reviens plus jamais à vide de mes livraisons entre Dakar et Bamako. Mes revenus ont augmenté de 35% en seulement 2 mois!",
    author: "Amadou Diallo",
    role: "Transporteur, Sénégal",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    id: 2,
    quote: "La facilité de poster nos marchandises et de suivre leur livraison en temps réel est incroyable. C'est exactement ce dont nous avions besoin pour notre entreprise textile.",
    author: "Fatoumata Traoré",
    role: "Expéditrice, Mali",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4
  },
  {
    id: 3,
    quote: "Le système de notation nous permet de choisir des transporteurs fiables à chaque fois. Notre taux de livraisons sans problème est passé à 98%!",
    author: "Ibrahim Konaté",
    role: "Directeur Logistique, Côte d'Ivoire",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    rating: 5
  },
  {
    id: 4,
    quote: "En tant que petit transporteur, RetourGo m'a permis de concurrencer les grandes entreprises en optimisant mes trajets retour. Application indispensable!",
    author: "Mariama Sow",
    role: "Transporteuse, Burkina Faso",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    rating: 5
  },
];

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
          clipRule="evenodd"
        />
      </svg>
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Nos utilisateurs témoignent</h2>
          <p className="mt-4 text-lg text-gray-500">
            Découvrez comment RetourGo transforme le quotidien des transporteurs et expéditeurs en Afrique de l'Ouest.
          </p>
        </div>

        <div className="relative mx-auto max-w-2xl">
          <Card className="p-6 md:p-10 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex mb-4">
                {renderStars(testimonials[activeIndex].rating)}
              </div>
              <p className="text-xl italic text-gray-700 mb-8">"{testimonials[activeIndex].quote}"</p>
              <img
                src={testimonials[activeIndex].avatar}
                alt={testimonials[activeIndex].author}
                className="h-16 w-16 rounded-full mb-4"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{testimonials[activeIndex].author}</h3>
                <p className="text-sm text-gray-500">{testimonials[activeIndex].role}</p>
              </div>
            </div>
          </Card>

          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 hidden md:block">
            <button
              onClick={handlePrev}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          </div>

          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 hidden md:block">
            <button
              onClick={handleNext}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
          
          {/* Mobile navigation */}
          <div className="flex justify-center mt-6 space-x-4 md:hidden">
            <button
              onClick={handlePrev}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 mx-1 rounded-full ${
                index === activeIndex ? "bg-retourgo-orange" : "bg-gray-300"
              }`}
              onClick={() => setActiveIndex(index)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
