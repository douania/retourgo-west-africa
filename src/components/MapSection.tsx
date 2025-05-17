
import { useState } from 'react';
import { Card } from "@/components/ui/card";

const MapSection = () => {
  // Simulating freight data points
  const freightPoints = [
    { id: 1, left: '20%', top: '40%', type: 'Textile', weight: '500kg' },
    { id: 2, left: '45%', top: '30%', type: 'Électronique', weight: '200kg' },
    { id: 3, left: '65%', top: '60%', type: 'Alimentaire', weight: '1000kg' },
    { id: 4, left: '30%', top: '70%', type: 'Construction', weight: '2000kg' },
    { id: 5, left: '75%', top: '35%', type: 'Médical', weight: '100kg' },
  ];

  const transportPoints = [
    { id: 1, left: '25%', top: '45%', type: 'Camion', capacity: '3T' },
    { id: 2, left: '55%', top: '25%', type: '4x4', capacity: '1T' },
    { id: 3, left: '70%', top: '55%', type: 'Camionnette', capacity: '1.5T' },
  ];

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Trouvez du fret en temps réel
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Notre carte interactive vous permet de visualiser les opportunités de fret disponibles 
            à proximité et d'optimiser vos trajets retour.
          </p>
        </div>

        <div className="relative h-[500px] bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-200">
          {/* Map background image - This would be a real map in production */}
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('https://i.imgur.com/tye2P2x.png')", 
              opacity: 0.8
            }}
          ></div>
          
          {/* Country borders overlay */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M20,20 L30,15 L40,25 L50,20 L60,30 L70,25 L80,40 L70,50 L80,60 L70,70 L60,65 L50,75 L40,65 L30,70 L20,60 Z" 
                fill="none" 
                stroke="#000" 
                strokeWidth="0.5"
              />
              <path 
                d="M30,30 L40,35 L50,30 L60,40 L50,50 L60,60 L50,65 L40,55 Z" 
                fill="none" 
                stroke="#000" 
                strokeWidth="0.5"
              />
            </svg>
          </div>
          
          {/* Freight points */}
          {freightPoints.map((point) => (
            <div
              key={`freight-${point.id}`}
              className="absolute w-5 h-5 bg-retourgo-orange rounded-full shadow-lg cursor-pointer map-point"
              style={{ left: point.left, top: point.top }}
              onClick={() => handleItemClick({ ...point, itemType: 'freight' })}
            ></div>
          ))}
          
          {/* Transport points */}
          {transportPoints.map((point) => (
            <div
              key={`transport-${point.id}`}
              className="absolute w-5 h-5 bg-retourgo-green rounded-full shadow-lg cursor-pointer map-point"
              style={{ left: point.left, top: point.top }}
              onClick={() => handleItemClick({ ...point, itemType: 'transport' })}
            ></div>
          ))}
          
          {/* Map legend */}
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-md shadow-md">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-retourgo-orange rounded-full mr-2"></div>
              <span className="text-xs text-gray-700">Fret disponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-retourgo-green rounded-full mr-2"></div>
              <span className="text-xs text-gray-700">Transporteur disponible</span>
            </div>
          </div>
        </div>
        
        {/* Item details card */}
        {selectedItem && (
          <Card className="mt-6 p-6 max-w-md mx-auto animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedItem.itemType === 'freight' ? 'Détails du fret' : 'Détails du transporteur'}
            </h3>
            {selectedItem.itemType === 'freight' ? (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Type: <span className="font-medium text-gray-900">{selectedItem.type}</span></p>
                <p className="text-sm text-gray-500">Poids: <span className="font-medium text-gray-900">{selectedItem.weight}</span></p>
                <p className="text-sm text-gray-500">Distance: <span className="font-medium text-gray-900">45 km</span></p>
                <p className="text-sm text-gray-500">Prix: <span className="font-medium text-gray-900">120 000 FCFA</span></p>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Véhicule: <span className="font-medium text-gray-900">{selectedItem.type}</span></p>
                <p className="text-sm text-gray-500">Capacité: <span className="font-medium text-gray-900">{selectedItem.capacity}</span></p>
                <p className="text-sm text-gray-500">Note: <span className="font-medium text-gray-900">★★★★☆ (4.2/5)</span></p>
                <p className="text-sm text-gray-500">Disponible dans: <span className="font-medium text-gray-900">30 min</span></p>
              </div>
            )}
            <button 
              className="mt-4 w-full py-2 bg-retourgo-orange text-white rounded-md hover:bg-retourgo-orange/90"
              onClick={() => alert('Fonctionnalité en développement')}
            >
              {selectedItem.itemType === 'freight' ? 'Contacter l\'expéditeur' : 'Contacter le transporteur'}
            </button>
          </Card>
        )}
      </div>
    </section>
  );
};

export default MapSection;
